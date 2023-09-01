enum Roles {
  WEBMASTER,
  CURATOR,
  TEAMLEAD,
  DIRECTOR,
  ADMIN,
}

const roles = Object.keys(Roles)
  .filter((key: string) => isNaN(Number(key)))
  .map((role: string) => role.toLowerCase());

export { Roles, roles };
