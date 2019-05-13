# uccx-config-client
This is a Node.js implementation of the Cisco UCCX System Configuration APIs.
It is not a complete implementation at this time.

# Usage
Check the files in test/ for examples of usage.

# Notes
All of the operations in this library point to the /adminapi URL on UCCX, with
the exception of the role editor. As of UCCX 12.0, it is still not possible to
change a resource to be a supervisor with the documented APIs. To work around
this, we use a series of REST requests to the admin web UI /appadmin to emulate
setting up a supervisor using the admin UI wizard "Add Supervisors".
