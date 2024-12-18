let protocol="http"
if (process.env.NODE_ENV === "PRODUCTION") {
  protocol = "http";
}

module.exports = protocol;