# Customer Membership Detail

---

## 1. Module Overview

- **Module Name:** Customer Membership Detail
- **Platform:** Admin Panel
- **Layout Type:** Desktop
- **Primary Role(s):** Admin
- **Goal:**  
Allow administrators to view detailed information about a customer's membership plan, payment progress, installment summary, and payment history.

---

## 2. Navigation & Entry Points

### 2.1 Left Navigation / Global Entry
This screen is **not directly accessible from navigation**.

### Entry Points
- Customers Listing → View Action
- Membership Users Module

### Navigation Rule
View → AD-CUST-DETAIL-01

---

## 3. Screen Inventory (Index)

| Screen ID | Screen Name | Screen Type | Primary Action |
|----------|------------|------------|----------------|
| AD-CUST-DETAIL-01 | Customer Membership Detail | Detail Modal | View Payment History |

---

# 4. Screens & Interaction Specs

---

# 4.1 Customer Membership Detail Screen

- **Screen ID:** AD-CUST-DETAIL-01
- **Screen Type:** Detail Modal
- **Primary Action:** View payment history
- **Secondary Actions:** Close

---

# Entry Points

- Click **View** from Customers List

Navigation:

Customers List → View → Customer Membership Detail

---

# Modal Layout

The modal contains **four sections**:

1. Modal Header
2. Customer Information
3. Membership Information
4. Payment Summary
5. Payment History

---

# Modal Header

| Element | Description |
|------|-------------|
| Title | Membership Details |
| Reference ID | Membership ID |
| Close Icon | Close modal |

Example:


Membership Details
MEM-2024-001


Close behavior:

Close → Return to Customers List

---

# Customer Information Section

Displays customer details.

| Field | Value Example |
|------|--------------|
| Name | Priya Sharma |
| Email | priya.sharma@email.com |

---

# Membership Information Section

| Field | Example |
|------|---------|
| Plan Name | Gold Savings Plan |
| Status | Active |
| Start Date | Jan 15, 2024 |
| End Date | Jan 15, 2025 |

---

# Status Badge Types

| Status | Style |
|------|------|
| Active | Green |
| Completed | Gray |
| Pending | Orange |

---

# Payment Summary Section

Displays high-level membership payment metrics.

Cards displayed horizontally.

| Card | Description |
|-----|-------------|
| Plan Amount | Total membership value |
| Total Paid | Amount paid by customer |
| Remaining | Remaining balance |
| Installments | Installment progress |

Example values:


Plan Amount: ₹60,000
Total Paid: ₹30,000
Remaining: ₹30,000
Installments: 6 / 12


---

# Payment Progress

Progress bar showing installment completion.

Example:


6 / 12 installments
50%


Progress visualization:

- Progress bar
- Percentage indicator

---

# Payment History Section

Displays installment payment records.

---

## Payment History Table

| Column | Description |
|------|-------------|
| Installment | Installment number |
| Amount | Payment amount |
| Date | Payment date |
| Method | Payment method |
| Status | Payment status |

---

### Example Rows

| Installment | Amount | Date | Method | Status |
|-------------|-------|------|-------|--------|
| #1 | ₹5,000 | Jan 15, 2024 | UPI | Paid |
| #2 | ₹5,000 | Feb 15, 2024 | Card | Paid |

---

# Payment Status Badge

| Status | Style |
|------|------|
| Paid | Green |
| Pending | Orange |
| Failed | Red |

---

# States

---

### Loading

Skeleton loaders appear for:

- Customer information
- Summary cards
- Payment history rows

---

### Empty Payment History


No payments recorded yet.


---

### Error


Unable to load membership details.
Please refresh the page.


---

# 5. Notifications & Feedback

Possible notifications:

- Payment record updated
- Failed to load payment history
- Membership details loaded

---

# 6. Access & Visibility Rules

| Action | Role |
|------|------|
| View Customer Membership | Admin |
| View Payment History | Admin |

---

# 7. Open Questions / TODOs

- Confirm if admin can manually add payments
- Confirm if refund actions exist
- Confirm if payment receipt download is required

---

# 8. Regeneration Rules

- Screen IDs must not change
- One screen = one Figma frame
- Preserve navigation rules