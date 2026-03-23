Update the Admin → Memberships section by implementing an “Add Membership” button and form workflow with the following behavior.

1. Add Membership Button

On the Memberships listing page, add a primary button called “Add Membership”.

The button should be placed in the top-right area of the page, consistent with other create actions in the admin panel.

When the admin clicks Add Membership, it should open the Add Membership form page.

2. Step 1 — Select Customer

Add a field:

Select Customer

Type: Searchable dropdown

The admin must select an existing customer from the system.

The dropdown should display Customer Name + Email or ID for easy identification.

This field is mandatory.

3. Step 2 — Select Plan

Add another field:

Select Plan

Type: Dropdown

Options should include:

Existing membership plans from the system

Custom

This field is mandatory.

4. If an Existing Plan is Selected

When the admin selects an existing plan, the system should automatically display the plan details below the dropdown.

Show the following readable plan information fields:

Plan ID

Plan Title

Description

Total Amount

Number of Installments

These fields should be auto-filled based on the selected plan and displayed in a structured layout.

5. If “Custom” Plan is Selected

If the admin selects Custom from the plan dropdown:

The admin should be able to manually define the membership plan details.

Display the following editable input fields:

Plan Description (Textarea)

Duration (Months) (Number input)

Total Amount (Currency input)

These fields allow the admin to create a custom plan specifically for that membership.

6. Form Actions

At the bottom of the form include:

Save / Create Membership (Primary button)

Cancel (Secondary button)

Behavior:

The admin must select a customer and a plan before saving.

If Custom plan is selected, all custom fields must be completed before submission.

7. Logical Flow

Admin clicks Add Membership.

Admin selects a Customer.

Admin selects a Plan.

If an existing plan is selected → plan details are automatically displayed.

If Custom is selected → admin manually enters plan details.

Admin clicks Save to create the membership.