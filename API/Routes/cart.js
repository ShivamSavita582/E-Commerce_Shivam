import  express from 'express'
import { addToCart, clearCart, decreaseProductQty, removeProductFromCart, userCart } from '../Controllers/cart.js';
import { Authenticated } from '../middlewares/auth.js';
const router = express.Router();
// addd to cart
router.post('/add',Authenticated,addToCart)

// get user cart

router.get('/user',Authenticated,userCart)

// remove cart
router.delete('/remove/:productId',Authenticated, removeProductFromCart)

// clear cart
router.delete('/clear',Authenticated, clearCart)

// decrease qty
router.post('/--qty', Authenticated,decreaseProductQty)

export default router;