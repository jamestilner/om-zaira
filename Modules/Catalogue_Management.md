# Catalogue Management

---

## 1. Module Overview

- **Module Name:** Product Catalogue
- **Platform:** Admin Panel
- **Layout Type:** Desktop
- **Primary Role(s):** Admin
- **Goal:**  
Allow administrators to manage jewellery products including catalogue items, inventory tracking, pricing, stock levels, and product availability.

---

## 2. Navigation & Entry Points

### Left Navigation

| Menu Label | Icon |
|------------|------|
| Catalogue | package |

Default Landing Screen:

AD-CAT-LIST-01

---

## 3. Screen Inventory

| Screen ID | Screen Name | Screen Type |
|----------|-------------|-------------|
| AD-CAT-LIST-01 | Product Catalogue | Listing |
| AD-CAT-CREATE-01 | Add Product | Modal |
| AD-CAT-EDIT-01 | Edit Product | Modal |
| AD-CAT-DETAIL-01 | Product Detail | Modal |

---

# 4. Screens & Interaction Specs

---

# 4.1 Product Catalogue Listing

Screen ID: AD-CAT-LIST-01  
Screen Type: Listing

Primary Action: Add Product

---

## Page Header

Title:

Product Catalogue

Subtitle:

Manage jewelry products and inventory

Right Side Button:

+ Add Product

Navigation:

Add Product → AD-CAT-CREATE-01

---

## Inventory Summary Cards

Three dashboard cards are displayed.

| Card | Description |
|------|-------------|
| Total Products | Total catalogue items |
| Available | Products currently in stock |
| Inventory Value | Total inventory value |

Example values:

Total Products: 10  
Available: 9  
Inventory Value: ₹67.7L

---

## Search & Filters

Search Placeholder:

Search products...

Filters dropdown supports:

- Category
- Price range
- Stock status

---

# Product Grid Layout

Products appear as **cards in grid layout**.

Each card displays:

- Product Image
- Category
- Product Name
- Description
- Price
- Discount (optional)
- Stock
- Weight
- Actions

---

# Product Card Example

Category: Necklace

Product Name: Diamond Eternity Necklace

Description:

Exquisite diamond necklace with intricate design

Price:

₹112,500

Discount:

10% OFF

Stock:

8 units

Weight:

15.5g

---

# Product Status Indicators

| Indicator | Description |
|----------|-------------|
| Discount Badge | Shows promotional discount |
| Out of Stock Badge | Indicates unavailable product |

---

# Product Card Actions

Icons displayed under card.

| Icon | Action |
|-----|--------|
| 👁 | View Product |
| ✏️ | Edit Product |
| 🗑 | Delete Product |

Navigation:

View → AD-CAT-DETAIL-01  
Edit → AD-CAT-EDIT-01

---

# States

### Loading

Skeleton product cards appear.

---

### Empty

No products available.

CTA:

Add Product

---

### Error

Unable to load catalogue products.

Please refresh the page.

---

# 4.2 Add Product Modal

Screen ID: AD-CAT-CREATE-01  
Screen Type: Modal Form

Primary Action: Create Product

---

## Modal Header

Title:

Add Product

Close icon:

X

---

## Form Fields

| Field | Type | Required |
|------|------|----------|
| Product Name | Text | Yes |
| Category | Dropdown | Yes |
| Description | Textarea | Yes |
| Price | Currency | Yes |
| Discount | Percentage | No |
| Stock Quantity | Number | Yes |
| Weight | Number | Yes |
| Product Images | Image Upload | Yes |
| Status | Toggle | Yes |

---

## Image Upload

Supports:

- Multiple images
- Drag & drop upload
- Preview before upload

---

## Buttons

| Button | Action |
|------|--------|
| Cancel | Close modal |
| Create Product | Save product |

Navigation:

Create Product → AD-CAT-LIST-01

---

# 4.3 Edit Product Modal

Screen ID: AD-CAT-EDIT-01  
Screen Type: Modal Form

Fields identical to Add Product.

Primary button:

Update Product

---

# 4.4 Product Detail Modal

Screen ID: AD-CAT-DETAIL-01  
Screen Type: Detail Modal

---

## Product Information

| Field | Example |
|------|---------|
| Product Image | Gallery |
| Product Name | Diamond Eternity Necklace |
| Category | Necklace |
| Price | ₹112,500 |
| Discount | 10% |
| Stock | 8 units |
| Weight | 15.5g |
| Description | Product description |

---

## Actions

| Button | Behavior |
|------|----------|
| Close | Close modal |
| Edit Product | Open Edit Modal |

Navigation:

Edit Product → AD-CAT-EDIT-01

---

# 5. Notifications

Success messages:

- Product created successfully
- Product updated successfully
- Product deleted successfully

Error messages:

- Failed to save product
- Failed to delete product

---

# 6. Access Rules

| Action | Role |
|------|------|
| View Catalogue | Admin |
| Add Product | Admin |
| Edit Product | Admin |
| Delete Product | Admin |

---

# 7. Regeneration Rules

- Screen IDs must remain stable
- One screen = one Figma frame
- Preserve navigation flows