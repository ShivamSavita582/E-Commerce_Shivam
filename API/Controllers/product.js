import { Products } from "../Models/Product.js";

// Generate slug from title
const generateSlug = (title) => {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") +
    "-" +
    Math.floor(1000 + Math.random() * 9000)
  );
};

// Add product
export const addProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      shortDescription,
      brand,
      category,
      subCategory,
      price,
      originalPrice,
      salePrice,
      discount,
      qty,
      sku,
      imgSrc,
      images,
      specifications,
      warranty,
      returnPolicy,
      isFeatured,
      isBestSeller,
      isNewArrival,
      freeShipping,
      tags,
    } = req.body;

    if (!title || !description || !price || !category || !imgSrc) {
      return res.status(400).json({
        message: "Title, description, price, category, and imgSrc are required.",
        success: false,
      });
    }

    const calculatedDiscount =
      discount ||
      (originalPrice && originalPrice > price
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : 0);

    const slug = req.body.slug || generateSlug(title);

    const product = await Products.create({
      title,
      slug,
      description,
      shortDescription: shortDescription || description.slice(0, 150),
      brand: brand || "Generic",
      category: category.toLowerCase(),
      subCategory: subCategory || "",
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : Number(price),
      salePrice: salePrice ? Number(salePrice) : Number(price),
      discount: calculatedDiscount,
      qty: qty !== undefined ? Number(qty) : 10,
      sku: sku || `SKU-${Date.now().toString().slice(-6)}`,
      imgSrc,
      images: Array.isArray(images) && images.length > 0 ? images : [imgSrc],
      specifications: specifications || {},
      warranty: warranty || "1 Year Official Warranty",
      returnPolicy: returnPolicy || "7 Days Return Policy",
      isFeatured: !!isFeatured,
      isBestSeller: !!isBestSeller,
      isNewArrival: isNewArrival !== undefined ? !!isNewArrival : true,
      isActive: true,
      freeShipping: freeShipping !== undefined ? !!freeShipping : true,
      tags: Array.isArray(tags) ? tags : [],
    });

    res.status(201).json({
      message: "Product added successfully",
      product,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// Get products with Search, Filter, Sort & Backend Pagination
export const getProduct = async (req, res) => {
  try {
    const {
      page,
      limit,
      category,
      brand,
      minPrice,
      maxPrice,
      rating,
      sort,
      search,
      featured,
      bestseller,
      newarrival,
    } = req.query;

    const filter = { isActive: true };

    if (category && category !== "all") {
      const catLower = category.toLowerCase().trim();
      let catPattern = `^${catLower}$`;
      if (
        catLower === "laptop" ||
        catLower === "laptops" ||
        catLower === "computers" ||
        catLower === "computer"
      ) {
        catPattern = "^(laptop|laptops|computer|computers)$";
      } else if (
        catLower === "mobile" ||
        catLower === "mobiles" ||
        catLower === "phone" ||
        catLower === "phones"
      ) {
        catPattern = "^(mobile|mobiles|phone|phones|smartphone|smartphones)$";
      } else if (catLower === "camera" || catLower === "cameras") {
        catPattern = "^(camera|cameras)$";
      } else if (
        catLower === "accessories" ||
        catLower === "accessory" ||
        catLower === "headphones" ||
        catLower === "audio"
      ) {
        catPattern = "^(accessories|accessory|headphone|headphones|audio)$";
      }
      filter.category = { $regex: new RegExp(catPattern, "i") };
    }

    if (brand && brand !== "all") {
      filter.brand = { $regex: new RegExp(brand, "i") };
    }

    if (featured === "true") {
      filter.isFeatured = true;
    }

    if (bestseller === "true") {
      filter.isBestSeller = true;
    }

    if (newarrival === "true") {
      filter.isNewArrival = true;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (rating) {
      filter.rating = { $gte: Number(rating) };
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { category: searchRegex },
        { brand: searchRegex },
      ];
    }

    // Sorting
    let sortQuery = { createdAt: -1 };
    if (sort === "low-high") {
      sortQuery = { price: 1 };
    } else if (sort === "high-low") {
      sortQuery = { price: -1 };
    } else if (sort === "rating") {
      sortQuery = { rating: -1 };
    } else if (sort === "name") {
      sortQuery = { title: 1 };
    } else if (sort === "newest") {
      sortQuery = { createdAt: -1 };
    } else if (sort === "featured") {
      sortQuery = { isFeatured: -1, createdAt: -1 };
    }

    // If page or limit specified, paginate
    if (page || limit) {
      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.max(1, parseInt(limit, 10) || 12);
      const skip = (pageNum - 1) * limitNum;

      const totalProducts = await Products.countDocuments(filter);
      const totalPages = Math.ceil(totalProducts / limitNum);

      const products = await Products.find(filter)
        .sort(sortQuery)
        .skip(skip)
        .limit(limitNum);

      return res.json({
        message: "All Products",
        products,
        currentPage: pageNum,
        totalPages,
        totalProducts,
        hasNextPage: pageNum < totalPages,
        hasPreviousPage: pageNum > 1,
        success: true,
      });
    }

    // Default backward compatible non-paginated return
    const products = await Products.find(filter).sort(sortQuery);

    res.json({
      message: "All Products",
      products,
      totalProducts: products.length,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// Find product by id or slug
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    let product;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Products.findById(id);
    }
    if (!product) {
      product = await Products.findOne({ slug: id });
    }

    if (!product) {
      return res.status(404).json({ message: "Product not found", success: false });
    }

    res.json({ message: "Specific Product", product, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// Update product by id
export const updateProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.body.price && req.body.originalPrice) {
      req.body.discount = Math.round(
        ((req.body.originalPrice - req.body.price) / req.body.originalPrice) *
          100
      );
    }

    const product = await Products.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found", success: false });
    }

    res.json({
      message: "Product has been updated successfully",
      product,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// Delete product by id
export const deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Products.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found", success: false });
    }

    res.json({
      message: "Product has been deleted successfully",
      product,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// Seed sample catalog
export const seedProductsCatalog = async (req, res) => {
  try {
    const { sampleProducts } = await import("../seedProducts.js");
    await Products.deleteMany({});
    const inserted = await Products.insertMany(sampleProducts);
    res.json({
      message: `Successfully seeded ${inserted.length} catalog products!`,
      products: inserted,
      count: inserted.length,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

