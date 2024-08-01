export function auth(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.redirect("/login");
  }
  next();
}

export function adminViewAuth(req, res, next) {
  if (req.session.user.role !== "admin") {
    return res.redirect("/");
  }
  next();
}

export const authorization = (role) => {
  return (req, res, next) => {
    if (!req.session.user) {
      return res
        .status(401)
        .send({ status: "error", message: "No user authenticated" });
    }

    const userRole = req.session.user.role;

    if (!role.includes(userRole))
      return res.status(403).send({ status: "error", error: "Not authorized" });
    next();
  };
};
