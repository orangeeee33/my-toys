import "./App.css";
import "./store.css";
import "./about.css";

import "./media.css";
import "./contact.css";

import { useState, useRef } from "react";
import { useVideoScroll } from "./hooks/useVideoScroll";


/* ==========================================
   TYPES
========================================== */

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  alt: string;
  badge?: string;
  badgeClass?: string;
};


type CartItem =
  Product & {
    quantity: number;
  };


/* ==========================================
   PRODUCTS
========================================== */

const products: Product[] = [
  {
    id: 1,
    name: "Woody Cowboy",
    price: 18,
    image: "./photo/woody.jpg",
    alt: "Woody cowboy toy",
    badge: "BEST SELLER"
  },
  {
    id: 2,
    name: "Papa Smurf",
    price: 15,
    image: "./photo/baba.jpg",
    alt: "Papa Smurf toy",
    badge: "NEW",
    badgeClass: "new"
  },
  {
    id: 3,
    name: "Buzz Lightyear",
    price: 20,
    image: "./photo/buzz.jpg",
    alt: "Buzz Lightyear toy"
  },
  {
    id: 4,
    name: "Slinky Dog",
    price: 16,
    image: "./photo/dog.jpg",
    alt: "Slinky Dog toy"
  },
  {
    id: 5,
    name: "Mr. Potato Head",
    price: 18,
    image: "./photo/potato.jpg",
    alt: "Mr. Potato Head toy"
  },
  {
    id: 6,
    name: "Gargamel",
    price: 13,
    image: "./photo/sharshabil.jpg",
    alt: "Gargamel toy"
  },
  {
    id: 7,
    name: "Smurfette",
    price: 15,
    image: "./photo/smurfs.jpg",
    alt: "Smurfette toy"
  }
];


function App() {

  /* ========================================
     VIDEO
  ======================================== */

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoSectionRef = useRef<HTMLElement>(null);
  const contactVideoRef = useRef<HTMLVideoElement>(null);
  


  /* ========================================
     STATE
  ======================================== */

  const [showMoreToys, setShowMoreToys] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const [cartMessage, setCartMessage]=useState("");

  useVideoScroll(videoRef, videoSectionRef);

    /* ========================================
   CONTACT VIDEO MOVEMENT
======================================== */

function moveContactVideo(
  event: React.PointerEvent<HTMLElement>
) {
  const video =
    contactVideoRef.current;

  if (
    !video ||
    !Number.isFinite(video.duration)
  ) {
    return;
  }

  const section =
    event.currentTarget;

  const sectionPosition =
    section.getBoundingClientRect();

  const pointerX =
    event.clientX -
    sectionPosition.left;

  const progress =
    Math.max(
      0,
      Math.min(
        1,
        pointerX /
          sectionPosition.width
      )
    );

  video.currentTime =
    progress *
    Math.max(
      0,
      video.duration - 0.05
    );
}

  /* ========================================
     ADD TO CART
  ======================================== */

 function addToCart(
  product: Omit<CartItem, "quantity">
) {
  setCart((currentCart) => {
    const existingItem =
      currentCart.find(
        (item) =>
          item.id === product.id
      );

    if (existingItem) {
      return currentCart.map(
        (item) =>
          item.id === product.id
            ? {
                ...item,
                quantity:
                  item.quantity + 1
              }
            : item
      );
    }

    return [
      ...currentCart,
      {
        ...product,
        quantity: 1
      }
    ];
  });

  setCartMessage(
    `${product.name} added to cart ✓`
  );

  window.setTimeout(() => {
    setCartMessage("");
  }, 2000);
}

  /* ========================================
     CHANGE QUANTITY
  ======================================== */

  function changeQuantity(productId: number, amount: number) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: item.quantity + amount
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }


  /* ========================================
     REMOVE ITEM
  ======================================== */

  function removeFromCart(productId: number) {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId)
    );
  }


  /* ========================================
     CART CALCULATIONS
  ======================================== */

  const totalQuantity = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const isWholesale = totalQuantity > 9;

  const originalTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const discount = isWholesale ? originalTotal * 0.2 : 0;

  const finalTotal = originalTotal - discount;

  const visibleProducts = showMoreToys ? products : products.slice(0, 2);


  /* ========================================
     CONFIRM ORDER
  ======================================== */

  function confirmOrder(
  event: React.FormEvent<HTMLFormElement>
) {
  event.preventDefault();

  const productsText = cart
    .map(
      (item) =>
        `• ${item.name} × ${item.quantity} = $${(
          item.price * item.quantity
        ).toFixed(2)}`
    )
    .join("\n");

 const discount =
  originalTotal - finalTotal;

const message =
  `*NEW TOYS ORDER*\n\n` +
  `${productsText}\n\n` +
  `Quantity: ${totalQuantity}\n` +
  `Order Type: ${
    isWholesale
      ? "WHOLESALE"
      : "RETAIL"
  }\n` +
  `Subtotal: $${originalTotal.toFixed(2)}\n` +
  (
    isWholesale
      ? `Wholesale Discount (20%): -$${discount.toFixed(2)}\n`
      : ""
  ) +
  `*TOTAL: $${finalTotal.toFixed(2)}*`;

  const whatsappNumber = "";

  const whatsappUrl =
    `https://wa.me/${whatsappNumber}` +
    `?text=${encodeURIComponent(message)}`;

  window.open(
    whatsappUrl,
    "_blank"
  );

  setCart([]);
  setIsCheckoutOpen(false);
  setIsCartOpen(false);
}
/* ========================================
   CONTACT WHATSAPP
======================================== */

function sendContactToWhatsApp(
  event: React.FormEvent<HTMLFormElement>
) {
  event.preventDefault();

  const form =
    new FormData(event.currentTarget);

  const name =
    String(
      form.get("contactName") || ""
    ).trim();

  const phone =
    String(
      form.get("contactPhone") || ""
    ).trim();

  const customerMessage =
    String(
      form.get("contactMessage") || ""
    ).trim();

  const message =
    `*NEW CONTACT MESSAGE*\n\n` +
    `Name: ${name}\n` +
    `Phone: ${phone}\n\n` +
    `Message:\n${customerMessage}`;

  const whatsappNumber =
    "";

  const whatsappUrl =
    `https://wa.me/${whatsappNumber}` +
    `?text=${encodeURIComponent(message)}`;

  window.open(
    whatsappUrl,
    "_blank",
    "noopener,noreferrer"
  );

  event.currentTarget.reset();
}

  return (
    <main>

      {/* =====================================
          FIXED NAVBAR
      ====================================== */}

      <header className="video-navbar">
        <a className="toy-logo" href="#home">
          MY TOYS
        </a>

        <nav className="video-nav-links">
         
          <a href="#toys">TOYS</a>
          <a href="#about">ABOUT</a>
          <a href="#contact">CONTACT</a>
        </nav>
      </header>


      {/* =====================================
          VIDEO SECTION
      ====================================== */}

      <section
        id="home"
        ref={videoSectionRef}
        className="video-scroll-section"
      >
        <div className="video-sticky">
          <video
            ref={videoRef}
            className="intro-video"
            src="./videos/boy-intro-scrub.mp4"
            muted
            playsInline
            preload="metadata"
          />

          <div className="video-title">
            <p>WELCOME TO</p>
            <h1>MY TOYS</h1>
          </div>

          <div className="scroll-message">
            <p>SCROLL TO SHOP</p>
            <span aria-hidden="true">↓</span>
          </div>
        </div>
      </section>


      {/* =====================================
          TOYS SECTION
      ====================================== */}

      <section id="toys" className="toys-section">
        <div className="toys-heading">
          <span>FIND YOUR NEW FRIEND</span>
          <h2>SHOP OUR TOYS</h2>
          <p>Cute toys, happy moments, and lots of fun.</p>
        </div>

        <div className="toys-grid">
          {visibleProducts.map((product) => (
            <article className="toy-card" key={product.id}>
              <div className="toy-image-wrapper">
                <img
                  src={product.image}
                  alt={product.alt}
                  loading="lazy"
                />

                {product.badge && (
                  <span
                    className={`toy-badge ${product.badgeClass ?? ""}`}
                  >
                    {product.badge}
                  </span>
                )}
              </div>

              <div className="toy-info">
                <h3>{product.name}</h3>

                <p className="toy-price">
                  {isWholesale && (
                    <span className="old-price">
                      ${product.price.toFixed(2)}
                    </span>
                  )}

                  <span>
                    $
                    {(
                      isWholesale
                        ? product.price * 0.8
                        : product.price
                    ).toFixed(2)}
                  </span>
                </p>

                <button
                  type="button"
                  onClick={() => addToCart(product)}
                >
                  ADD TO CART
                </button>
              </div>
            </article>
          ))}
        </div>

        <button
          type="button"
          className="view-more-toys"
          onClick={() => setShowMoreToys(!showMoreToys)}
          aria-expanded={showMoreToys}
        >
          {showMoreToys ? "SHOW LESS" : "VIEW MORE TOYS"}
        </button>
      </section>


      
 {/* =====================================
    ABOUT
====================================== */}

<section id="about" className="about-section">

  <div className="about-decoration about-circle-one" />
  <div className="about-decoration about-circle-two" />

  <div className="about-content">

    <div className="about-heading">
      <span>WELCOME TO OUR WORLD</span>

      <h2>
        MORE THAN
        <br />
        JUST TOYS
      </h2>
    </div>


    <div className="about-text">
      <p className="about-intro">
        At My Toys, every toy is chosen to bring
        happiness, imagination, and unforgettable
        moments to every child.
      </p>

      <p>
        Whether you are looking for one special gift
        or ordering toys in larger quantities, we make
        shopping simple, fun, and convenient.
      </p>

      <a href="#toys" className="about-shop-button">
        DISCOVER OUR TOYS
      </a>
    </div>

  </div>


  <div className="about-features">

    <article className="about-feature">
      <span className="about-feature-number">
        01
      </span>

      <h3>LOVED TOYS</h3>

      <p>
        Carefully selected characters and toys
        children love.
      </p>
    </article>


    <article className="about-feature">
      <span className="about-feature-number">
        02
      </span>

      <h3>RETAIL & WHOLESALE</h3>

      <p>
        Buy one special toy or enjoy 20% off
        when ordering 10 toys or more.
      </p>
    </article>


    <article className="about-feature">
      <span className="about-feature-number">
        03
      </span>

      <h3>EASY DELIVERY</h3>

      <p>
        Choose delivery to your address or pick
        up your order directly from our store.
      </p>
    </article>

  </div>


      </section>

<div className="section-checkered-divider" aria-hidden="true"/>
    {/* =====================================
    CONTACT
====================================== */}

<section
  id="contact"
  className="contact-section"
  onPointerMove={moveContactVideo}
>

  <div className="contact-character">

   
   
<video
  ref={contactVideoRef}
  className="contact-boy-video"
  src="./videos/contact-boy-scrub.mp4"
  muted
  playsInline
  autoPlay
  preload="auto"
  controls={false}
  onPlaying={(event) => {
    const video = event.currentTarget;

    if (video.dataset.primed === "true") {
      return;
    }

    video.dataset.primed = "true";
    video.pause();

    if (
      Number.isFinite(video.duration) &&
      video.duration > 0
    ) {
      video.currentTime = Math.min(
        video.duration / 2,
        video.duration - 0.05
      );
    }
  }}
/>

  </div>


  <div className="contact-content">

    <span className="contact-small-title">
      WE WOULD LOVE TO HEAR FROM YOU
    </span>

    <h2>CONTACT US</h2>

    <p className="contact-description">
      Have a question about a toy, wholesale orders,
      or delivery? Send us a message and we will be
      happy to help.
    </p>


    <form className="contact-form"
    onSubmit={sendContactToWhatsApp}>

      <label>
        YOUR NAME

        <input
          type="text"
          name="contactName"
          placeholder="Enter your name"
          required
        />
      </label>


      <label>
        PHONE NUMBER

        <input
          type="tel"
          name="contactPhone"
          placeholder="Enter your phone number"
          required
        />
      </label>


      <label>
        YOUR MESSAGE

        <textarea
          name="contactMessage"
          placeholder="How can we help you?"
          rows={5}
          required
        />
      </label>


      <button type="submit">
        SEND ON WHATSAPP
      </button>

    </form>

  </div>

</section>

      {/* =====================================
          CART BUTTON
      ====================================== */}

      <button
        type="button"
        className="cart-button"
        onClick={() => setIsCartOpen(true)}
      >
        CART ({totalQuantity})
      </button>


      {/* =====================================
          CART OVERLAY
      ====================================== */}

      {isCartOpen && (
        <div
          className="cart-overlay"
          onClick={() => setIsCartOpen(false)}
        />
      )}


      {/* =====================================
          CART PANEL
      ====================================== */}

      <aside className={`cart-panel ${isCartOpen ? "open" : ""}`}>
        <div className="cart-header">
          <h2>YOUR CART</h2>
          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart"
          >
            ×
          </button>
        </div>

        {cart.length === 0 ? (
          <p className="empty-cart">Your cart is empty.</p>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <article className="cart-item" key={item.id}>
                  <img src={item.image} alt={item.alt} />

                  <div className="cart-item-info">
                    <h3>{item.name}</h3>

                    <p className="cart-item-price">
                      {isWholesale && (
                        <span className="old-price">
                          ${item.price.toFixed(2)}
                        </span>
                      )}

                      <span>
                        $
                        {(
                          isWholesale
                            ? item.price * 0.8
                            : item.price
                        ).toFixed(2)}
                      </span>
                    </p>

                    <div className="quantity-controls">
                      <button
                        type="button"
                        onClick={() => changeQuantity(item.id, -1)}
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => changeQuantity(item.id, 1)}
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      className="remove-item"
                      onClick={() => removeFromCart(item.id)}
                    >
                      REMOVE
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="cart-summary">
              <p>
                Total quantity: <strong>{totalQuantity}</strong>
              </p>

              <p>
                Order type: <strong>{isWholesale ? "WHOLESALE" : "RETAIL"}</strong>
              </p>

              {isWholesale && (
                <>
                  <p>
                    Original total:
                    <span className="old-price">
                      ${originalTotal.toFixed(2)}
                    </span>
                  </p>

                  <p className="discount-line">
                    Wholesale discount:
                    <strong>-${discount.toFixed(2)}</strong>
                  </p>
                </>
              )}

              <p className="final-total">
                Total: <strong>${finalTotal.toFixed(2)}</strong>
              </p>

              {!isWholesale && (
                <small>
                  Add {10 - totalQuantity} more toy(s) to receive
                  20% wholesale discount.
                </small>
              )}
            </div>

            <button
              type="button"
              className="checkout-button"
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
            >
              CHECKOUT
            </button>
          </>
        )}
      </aside>


      {/* =====================================
          CHECKOUT
      ====================================== */}

      {isCheckoutOpen && (
        <div className="checkout-overlay">
          <div className="checkout-modal">
            <button
              type="button"
              className="close-checkout"
              onClick={() => setIsCheckoutOpen(false)}
              aria-label="Close checkout"
            >
              ×
            </button>

            <h2>CHECKOUT</h2>

            <p>
              {isWholesale
                ? "WHOLESALE ORDER — 20% OFF"
                : "RETAIL ORDER"}
            </p>

            <form onSubmit={confirmOrder}>
              <label>
                Full name
                <input type="text" name="name" required />
              </label>

              <label>
                Phone number
                <input type="tel" name="phone" required />
              </label>

              <label>
                Address
                <textarea name="address" required />
              </label>

              <label>
                Delivery method
                <select name="deliveryMethod" required>
                  <option value="">Select</option>
                  <option value="delivery">Delivery</option>
                  <option value="pickup">Pick up from store</option>
                </select>
              </label>

              <label>
                Payment method
                <select name="paymentMethod" required>
                  <option value="">Select</option>
                  <option value="cash">Cash</option>
                  <option value="transfer">Money transfer</option>
                </select>
              </label>

              <div className="checkout-total">
                <span>Total</span>
                <strong>${finalTotal.toFixed(2)}</strong>
              </div>

              <button
                type="submit"
                className="confirm-order-button"
              >
                CONFIRM ORDER
              </button>
            </form>
          </div>
        </div>
      )}


      {cartMessage && (
  <div
    className="cart-message"
    role="status"
  >
    {cartMessage}
  </div>
)}

    </main>
  );
}




export default App;