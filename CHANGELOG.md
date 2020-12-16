# Change Log for uccx-config-client

Versions are semever-compatible dates in YYYY.MM.DD-X format,
where X is the revision number

# 2020.12.16

### Features
* **App Admin/Role:** Add CSRF token to the requests that change resource (user)
roles, such as adding the supervisor role. This is required for UCCX 12.5 and
later, and is now set by default. Set this to false in the main constructor
if you are using UCCX 12.0.
