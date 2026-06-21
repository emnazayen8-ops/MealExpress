# 🍽️ MealExpress

> Authentic Tunisian food boxes, delivered monthly to your doorstep.

MealExpress is a full-stack subscription e-commerce platform built with React, Node.js, Express, and MongoDB. Customers can subscribe to curated Tunisian food boxes, track their deliveries in real time, and manage their subscriptions — all powered by Stripe payments.

---

## 🌐 Live Demo

| | Link |
|---|---|
| 🖥️ **Frontend** | [meal-express-loe27w46h-meal-express.vercel.app](https://meal-express-loe27w46h-meal-express.vercel.app) |
| ⚙️ **Backend API** | [mealexpress-backend.onrender.com](https://mealexpress-backend.onrender.com) |

---

## 🎬 Demo Video

🔗 [Watch the full demo (2 min)]
(https://streamable.com/kyi56d)

---

## ✨ Features

### Customer Side
| Module | Description |
|--------|-------------|
| 🔐 **Authentication** | Secure login/register with JWT, User & Admin roles |
| 📦 **Boxes** | Catalogue of Tunisian food boxes with details and included products |
| 🛒 **Orders** | Order placement with real-time tracking and history |
| 🔄 **Subscriptions** | Recurring payments via Stripe (secure webhooks), cancel anytime |
| 📊 **User Dashboard** | Personal stats (subscriptions, orders, deliveries), Orders/Subscriptions tabs |
| 🚚 **Order Tracking** | Interactive visual timeline: Confirmed → Preparing → Shipped → In Transit → Delivered |
| 📧 **Contact** | Contact form with email sending (Nodemailer) and FAQ |
| 📱 **Responsive** | 100% mobile-first adaptive interface with Tailwind CSS |

### Admin Side
| Module | Description |
|--------|-------------|
| 📈 **Analytics** | Total revenue, delivery rate, cancellation rate, Recharts graphs |
| 📦 **Box Management** | Full CRUD (Create, Read, Update, Delete) with image upload |
| 🍎 **Product Management** | Products CRUD per box with Cloudinary upload |
| 📋 **Order Management** | Orders list, search by customer/email/box, status filters, delivery status update |
| 💬 **Customer Messages** | Read contact messages, unread badge, reply via Gmail |
| 📤 **Cloudinary Upload** | Real-time image storage and optimization |

---

## 🛠️ Tech Stack

### Backend
| Technology | Usage |
|------------|-------|
| **Node.js** + **Express** | REST API server |
| **MongoDB** + **Mongoose** | NoSQL database |
| **JWT** + **bcryptjs** | Secure authentication |
| **Stripe** | Payments and recurring subscriptions |
| **Cloudinary** + **Multer** | Image upload and storage |
| **Nodemailer** | Contact email sending |
| **CORS** | Cross-origin request handling |

### Frontend
| Technology | Usage |
|------------|-------|
| **React 19** | User interface |
| **Vite 8** | Build tool and dev server |
| **React Router 7** | SPA navigation |
| **Tailwind CSS 4** | Utility-first styling |
| **Axios** | HTTP requests |
| **Recharts** | Charts and data visualizations |

---

## 📁 Project Structure

```
MealExpress/
├── 📄 README.md                    
├── 📄 .gitignore                                    
│
├── 📁 backend/
│   ├── 📁 config/
│   │   ├── db.js
│   │   └── cloudinary.js
│   ├── 📁 controllers/
│   │   ├── authController.js
│   │   ├── boxController.js
│   │   ├── contactController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   └── subscriptionController.js
│   ├── 📁 middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── 📁 models/
│   │   ├── Box.js
│   │   ├── Contact.js
│   │   ├── Order.js
│   │   ├── Product.js
│   │   ├── Subscription.js
│   │   └── User.js
│   ├── 📁 routes/
│   │   ├── authRoutes.js
│   │   ├── boxRoutes.js
│   │   ├── contactRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── productRoutes.js
│   │   └── subscriptionRoutes.js
│   ├── 📁 uploads/                 
│   ├── .env                        
│   ├── check-db.js
│   ├── check-subscriptions.js
│   ├── create-admin.js
│   ├── fix-orders.js
│   ├── package.json
│   ├── package-lock.json
│   ├── reset-admin-password.js
│   ├── seed.js
│   └── server.js
│
└── 📁 frontend/
    ├── 📁 dist/                    
    ├── 📁 node_modules/            
    ├── 📁 public/
    │   └── team/
    ├── 📁 src/
    │   ├── 📁 components/
    │   │   ├── BoxForm.jsx
    │   │   ├── BoxProducts.jsx
    │   │   ├── DeliveryTimeline.jsx
    │   │   ├── Footer.jsx
    │   │   ├── Loading.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── OrderCard.jsx
    │   │   ├── ProductForm.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   └── SalesChart.jsx
    │   ├── 📁 config/
    │   │   └── api.js
    │   ├── 📁 context/
    │   │   └── ToastContext.jsx
    │   ├── 📁 pages/
    │   │   ├── About.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   ├── BoxDetails.jsx
    │   │   ├── Boxes.jsx
    │   │   ├── Contact.jsx
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── NotFound.jsx
    │   │   ├── OrderTracking.jsx
    │   │   ├── Register.jsx
    │   │   └── UserDashboard.jsx
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── package-lock.json
    ├── vercel.json
    └── vite.config.js
    
```

---

## ⚙️ Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org) ≥ 20
- [MongoDB](https://mongodb.com) (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- [Stripe](https://stripe.com) account
- [Cloudinary](https://cloudinary.com) account

### 1. Clone the repository

```bash
git clone https://github.com/emnazayen8-ops/mealexpress.git
cd mealexpress
```

### 2. Backend setup

```bash
cd backend
npm install
```


Start the backend:

```bash
node server.js
```

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend folder:

```env
VITE_API_URL=https://mealexpress-backend.onrender.com
```

Start the frontend:

```bash
npm run dev
```

### 4. Seed the database (optional)

```bash
cd backend
node seed.js
```

### 5. Stripe webhooks (local development)

```bash
stripe login
stripe listen --forward-to localhost:5000/api/subscriptions/webhook
```

---

## 🌐 Deployment

### MongoDB Atlas
1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a database user
3. Allow network access from anywhere (0.0.0.0/0)
4. Get the connection string and update `MONGO_URI`

### Cloudinary
1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Get your cloud name, API key, and API secret
3. Add them to your environment variables

### Backend — Render
1. Push backend to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Set build command: `npm install`
4. Set start command: `node server.js`
5. Add all environment variables

### Frontend — Vercel
1. Push frontend to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add environment variable: `VITE_API_URL=https://mealexpress-backend.onrender.com`
4. Deploy

---

## 🔐 Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Backend port (default: 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret (`whsec_...`) |
| `FRONTEND_URL` | Frontend URL for Stripe redirects |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

---

## 📧 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/profile` | Get user profile |

### Boxes
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/boxes` | Get all boxes |
| GET | `/api/boxes/:id` | Get box by ID |
| POST | `/api/admin/boxes` | Create box (admin) |
| PUT | `/api/admin/boxes/:id` | Update box (admin) |
| DELETE | `/api/admin/boxes/:id` | Delete box (admin) |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/orders/my-orders` | Get user orders |
| GET | `/api/orders/:id` | Get order by ID |
| GET | `/api/orders` | Get all orders (admin) |
| PUT | `/api/orders/:id/status` | Update order status (admin) |

### Subscriptions
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/subscriptions/create-checkout-session` | Create Stripe session |
| POST | `/api/subscriptions/simulate` | Demo mode subscription |
| POST | `/api/subscriptions/cancel` | Cancel subscription |
| GET | `/api/subscriptions/my-subscriptions` | Get user subscriptions |

### Contact
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/contact` | Send message |
| GET | `/api/contact` | Get all messages (admin) |
| PUT | `/api/contact/:id/read` | Mark as read (admin) |
| DELETE | `/api/contact/:id` | Delete message (admin) |

---

## 👥 Team

| Name | Role |
|---|---|
| Emna Zayen | Founder & CEO |
| Eya Zayen | Head of Sourcing |
| Edam Zayen | Customer Experience |

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the project
2. Create a branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 🙏 Acknowledgements

- [Stripe](https://stripe.com) for secure payment integration
- [Cloudinary](https://cloudinary.com) for image storage and optimization
- [Tailwind CSS](https://tailwindcss.com) for the utility-first design system
- [Recharts](https://recharts.org) for data visualizations
- [MongoDB Atlas](https://www.mongodb.com/atlas) for cloud database hosting

---
