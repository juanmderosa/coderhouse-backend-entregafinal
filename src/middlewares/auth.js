export function auth(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.redirect("/login");
  }
  next();
}

export const authorization = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res
        .status(401)
        .json({ status: "error", message: "No user authenticated" });
    }

    const userRole = req.user.role;

    if (!role.includes(userRole))
      return res.status(403).send({ status: "error", error: "Not authorized" });
    next();
  };
};
