Event Management — Final Specs

1. Event Listing Page
Header:

Page title: "Events"
Breadcrumb: Event Management → Events
Buttons: Search, Filters, + Add New

Filters:

Event Type (from Master)
Status (Upcoming / Past)
Date Range picker

Listing View (card or table — toggle):
Each card/row shows:

Event Title
Event Type badge
Date & Time (e.g., 05 Jan 2025, 6:00 PM – 9:00 PM)
Venue Name
Status badge (Upcoming / Past)
Action menu (⋮): Options based on RBAC


2. Event Detail Page
Header:

Event title
Breadcrumb: Event Management → Events → [Event Name]
Buttons: Edit, Back (based on RBAC)

Section 1 — Event Info:

Event Type badge
Event Title
Date & Time (e.g., 05 Jan 2025, 6:00 PM – 9:00 PM)
Venue Name
Full Address

Section 2 — Event Banner:

Display uploaded banner image
Option to replace image

Section 3 — About This Event:

Full description text

Section 4 — Event Highlights:

List of highlight points


3. Add / Edit Event Page
Header:

Page title: "Add Event" / "Edit Event"
Breadcrumb: Event Management → Events → Add Event
Buttons: Save, Back

Section 1 — Event Details:
FieldTypeValidationEvent TitleText inputRequired, max 100 charsEvent TypeDropdown (from Master)RequiredDateDate pickerRequired, future date on AddStart TimeTime pickerRequiredEnd TimeTime pickerRequired, must be after Start TimeVenue NameText inputRequiredFull AddressTextareaRequired
Date and time displayed together in all views as: DD MMM YYYY, H:MM AM/PM – H:MM AM/PM
Section 2 — Event Banner:

Upload image (JPG/PNG, max 10MB)
Preview after upload
Required

Section 3 — About This Event:

Textarea
Max 500 words
Word count indicator
Required

Section 4 — Event Highlights:

Dynamic list — "+ Add Highlight" button
Each highlight: text input with remove (×) button
Minimum 1 required


Key Business Rules
RuleDetailPast eventsCannot be edited once event date has passedDeleteWarning shown if attendees are registeredEvent TypeManaged from Master moduleDate & Time displayAlways shown together across all three screens