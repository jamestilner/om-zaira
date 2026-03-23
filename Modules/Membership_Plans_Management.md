# Membership Plans Management

---

## 1. Module Overview

- **Module Name:** Membership Plans
- **Platform:** Admin Panel
- **Layout Type:** Desktop
- **Primary Role(s):** Admin
- **Goal:**  
Allow administrators to create, manage, and monitor membership plans offered to customers, including plan pricing, installments, benefits, and subscriber statistics.

---

## 2. Navigation & Entry Points

### 2.1 Left Navigation / Global Entry
- **Menu Label:** Plans
- **Menu Icon (suggested):** crown
- **Menu Level:** Primary
- **Default Landing Screen ID:** AD-PLAN-LIST-01

### 2.2 Visibility Rules
- Visible to:
  - ✅ Admin
  - ❌ Customers

---

## 3. Screen Inventory (Index)

| Screen ID | Screen Name | Screen Type | Primary Action |
|----------|-------------|-------------|----------------|
| AD-PLAN-LIST-01 | Membership Plans | Listing | Add Plan |
| AD-PLAN-CREATE-01 | Add New Plan | Modal Form | Create |
| AD-PLAN-DETAIL-01 | Plan Details | Detail Modal | View |

---

# 4. Screens & Interaction Specs

---

# 4.1 Membership Plans Listing

- **Screen ID:** AD-PLAN-LIST-01  
- **Screen Type:** Listing  
- **Primary Action:** Add Plan  
- **Secondary Actions:** View, Edit, Enable / Disable  

---

## Entry Points

- Click **Plans** from left navigation
- Redirect after creating or updating plan

---

## UI Layout

The page contains:

1. Page Header
2. Plan Statistics Cards
3. Search Bar
4. Membership Plan Cards Grid

---

## Page Header

| Element | Description |
|------|-------------|
| Title | Membership Plans |
| Subtitle | Create and manage membership plans |

Right side CTA:

**+ Add New Plan**

Navigation:

Add New Plan → AD-PLAN-CREATE-01

---

## Plan Statistics Cards

Three dashboard metric cards appear.

| Card | Description |
|-----|-------------|
| Total Plans | Total number of plans |
| Active Plans | Number of active plans |
| Total Subscribers | Total subscribed users |

Example values:

Total Plans: 5  
Active Plans: 4  
Total Subscribers: 750

---

## Search Bar

Placeholder:

Search plans...

Supports search by:

- Plan Name
- Plan Type

---

## Membership Plans Grid

Plans appear as **cards**.

Each card includes:

- Plan Icon
- Plan Name
- Status Badge
- Description
- Plan Price
- Installment structure
- Benefits preview
- Subscriber count
- Action buttons

---

## Plan Card Example

Plan Name: Gold Savings Plan  
Description: Most popular plan with excellent value  

Price: ₹60,000  
Installments: 12 installments of ₹5,000/month

Benefits preview:

- 10% discount on jewelry purchases
- Priority access to exclusive collections
- Free jewelry cleaning twice a year
+3 more benefits

Subscribers: 328

---

## Status Badges

| Status | Style |
|------|------|
| Active | Green |
| Inactive | Gray |

---

## Plan Card Actions

| Button | Action |
|------|--------|
| View | Open Plan Detail Modal |
| Edit | Open Edit Plan Modal |
| Disable | Disable active plan |
| Enable | Enable inactive plan |

Navigation rules:

View → AD-PLAN-DETAIL-01  
Edit → Edit Plan Modal

---

## Enable / Disable Confirmation

Title: Disable Plan  

Message:  
Are you sure you want to disable this plan?

---

## States

### Loading
Skeleton cards appear while loading plans.

### Empty

No membership plans available.

CTA:

Add New Plan

### Error

Unable to load membership plans.  
Please refresh the page.

---

# 4.2 Add New Plan Modal

- **Screen ID:** AD-PLAN-CREATE-01
- **Screen Type:** Modal Form
- **Primary Action:** Create Plan
- **Secondary Action:** Cancel

---

## Entry Points

Click **+ Add New Plan**

---

## Modal Header

Title: Add New Plan

Close icon (X)

Close → Return to Plan Listing

---

## Form Fields

| Field | Type | Required | Placeholder |
|------|------|----------|-------------|
| Plan Name | Text | Yes | e.g. Gold Savings Plan |
| Description | Textarea | No | Describe the plan |
| Total Amount (₹) | Currency | Yes | 60000 |
| Number of Installments | Number | Yes | 12 |
| Plan Color | Dropdown | Yes | Primary (Bronze) |
| Benefits | Dynamic List | Yes | Enter a benefit |

---

## Plan Color Options

- Primary (Bronze)
- Gold
- Platinum
- Diamond

---

## Benefits Field

Benefits are dynamic list inputs.

Example:

- 10% discount on jewelry purchases  
- Priority access to new collections  
- Free jewelry cleaning twice a year  

---

## Add Another Benefit

Button:

+ Add Another Benefit

Adds additional benefit field.

---

## Modal Buttons

| Button | Action |
|------|--------|
| Cancel | Close modal |
| Create Plan | Save plan |

Navigation:

Create Plan → AD-PLAN-LIST-01

---

## Validation Rules

| Field | Rule |
|------|------|
| Plan Name | Required |
| Total Amount | Must be numeric |
| Installments | Must be numeric |
| Plan Color | Must be selected |
| Benefits | At least one required |

---

## Validation Messages

Please enter a plan name  
Please enter total plan amount  
Please enter number of installments  
Please select plan color  
Please add at least one benefit

---

## Success Feedback

Membership plan created successfully.

---

## Error

Unable to create plan.  
Please try again.

---

# 4.3 Plan Detail Modal

- **Screen ID:** AD-PLAN-DETAIL-01
- **Screen Type:** Detail Modal
- **Primary Action:** Edit Plan
- **Secondary Action:** Close

---

## Entry Points

Plans Listing → View

---

## Modal Header

Title: Plan Details

Close icon (X)

Close → Return to Plans Listing

---

## Plan Overview

| Field | Example |
|------|--------|
| Plan Name | Silver Basic |
| Description | Perfect entry-level plan for new members |
| Status | Active |

---

## Pricing Details

Three pricing cards are shown.

| Card | Example |
|-----|---------|
| Total Amount | ₹36,000 |
| Installments | 12 months |
| Monthly Payment | ₹3,000 |

---

## Plan Benefits

Displayed as checklist.

Example:

- 5% discount on all jewelry purchases
- Early access to new collections
- Free annual jewelry cleaning
- Birthday special offers

---

## Statistics

| Metric | Example |
|------|--------|
| Total Subscribers | 142 |

---

## Footer Actions

| Button | Action |
|------|--------|
| Close | Close modal |
| Edit Plan | Open Edit Plan Modal |

Navigation:

Edit Plan → Edit Plan Modal

---

## States

### Loading
Skeleton loaders for plan details.

### Empty Benefits

No benefits added for this plan.

### Error

Unable to load plan details.  
Please refresh the page.

---

# 5. Notifications & Feedback

Success messages:

- Plan created successfully
- Plan updated successfully
- Plan disabled successfully
- Plan enabled successfully

Error messages:

- Failed to create plan
- Failed to update plan

---

# 6. Access & Visibility Rules

| Action | Role |
|------|------|
| View Plans | Admin |
| Create Plan | Admin |
| View Plan Details | Admin |
| Edit Plan | Admin |
| Enable / Disable Plan | Admin |

---

# 7. Open Questions / TODOs

- Confirm if plan deletion is allowed
- Confirm maximum benefits allowed
- Confirm subscriber analytics requirements

---

# 8. Regeneration Rules

- Screen IDs must not change
- One screen = one Figma frame
- Preserve navigation rules