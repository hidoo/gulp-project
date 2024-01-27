export const register = (handlebars) => {
  handlebars.registerHelper(
    'wrapBrackets',
    (value) => new handlebars.SafeString(`[[ ${value} ]]`)
  );
};
