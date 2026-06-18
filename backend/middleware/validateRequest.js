const validateRequest = (schema) => (req, res, next) => {
  const parsed = schema.safeParse(req.body);

  if (!parsed.success) {
    const message = parsed.error.issues.map((issue) => issue.message).join(". ");
    return res.status(400).json({
      error: message || "Invalid request payload.",
    });
  }

  req.body = parsed.data;
  next();
};

module.exports = validateRequest;
