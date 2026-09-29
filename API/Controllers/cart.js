import { Cart } from "../Models/Cart.js";
import { Products } from "../Models/Product.js";

// Add to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, title, price, qty, imgSrc } = req.body;
    const userId = req.user._id || req.user;
    const quantityToAdd = Number(qty) || 1;
    const unitPrice = Number(price) || 0;

    // Check stock availability
    const product = await Products.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found", success: false });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    const currentQtyInCart = itemIndex > -1 ? cart.items[itemIndex].qty : 0;
    const newTotalQty = currentQtyInCart + quantityToAdd;

    if (product.qty !== undefined && newTotalQty > product.qty) {
      return res.status(400).json({
        message: `Only ${product.qty} item(s) available in stock.`,
        availableStock: product.qty,
        success: false,
      });
    }

    if (itemIndex > -1) {
      cart.items[itemIndex].qty = newTotalQty;
      cart.items[itemIndex].price = unitPrice * newTotalQty;
    } else {
      cart.items.push({
        productId,
        title: title || product.title,
        price: unitPrice * quantityToAdd,
        qty: quantityToAdd,
        imgSrc: imgSrc || product.imgSrc,
      });
    }

    await cart.save();
    res.json({ message: "Item added to cart", cart, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// Get user cart
export const userCart = async (req, res) => {
  try {
    const userId = req.user._id || req.user;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }

    res.json({ message: "User cart", cart, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// Remove from user cart
export const removeProductFromCart = async (req, res) => {
  try {
    const productId = req.params.productId;
    const userId = req.user._id || req.user;

    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found", success: false });

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );
    await cart.save();

    res.json({ message: "Product removed from cart", cart, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id || req.user;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    } else {
      cart.items = [];
    }
    await cart.save();

    res.json({ message: "Cart cleared", cart, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// Decrease qty from cart
export const decreaseProductQty = async (req, res) => {
  try {
    const { productId, qty } = req.body;
    const userId = req.user._id || req.user;
    const quantityToSubtract = Number(qty) || 1;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      const item = cart.items[itemIndex];
      const unitPrice = item.price / item.qty;

      if (item.qty > quantityToSubtract) {
        item.qty -= quantityToSubtract;
        item.price = Math.round(unitPrice * item.qty * 100) / 100;
      } else {
        cart.items.splice(itemIndex, 1);
      }

      await cart.save();
      return res.json({ message: "Item quantity updated", cart, success: true });
    } else {
      return res.status(404).json({ message: "Product not in cart", success: false });
    }
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};
