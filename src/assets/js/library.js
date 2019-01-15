/**
 * library.js
 * useful js functions
 * ex.  email validation routine
 *
 */

export function isEmail(email) {
  // returns true or false if email is correctly formatted

  // test length
  if (email.length < 6) return false;

  // test for @ character
  if (email.indexOf("@") < 1) return false;

  // split at the @, making sure it is only 2
  // then test each part
  let emailArray = email.split("@");
  if (emailArray.length !== 2) return false;
  let local = emailArray[0];
  let domain = emailArray[1];

  // test for invalid characters
  let regex = /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~.-]+$/;
  if (!local.match(regex)) return false;

  // test for periods in a row in domain
  regex = /\.{2,}/;
  if (domain.match(regex)) return false;

  // test for leading and trailing whitespace and periods
  if (
    domain.trim() !== domain ||
    domain.startsWith(".") ||
    domain.endsWith(".")
  )
    return false;

  // split the domain at the periods, making sure at least 2
  let domainSubs = domain.split(".");
  if (domainSubs.length < 2) return false;
  // make sure both

  // loop through each sub and perform test for invalid chars
  // and leading/trailing whitespace and hyphens
  domainSubs.forEach(sub => {
    if (sub.trim() !== sub || sub.startsWith("-") || sub.endsWith("-"))
      return false;
    let regex = /^[a-z0-9-]+$/i;
    if (!sub.match(regex)) return false;
  });

  // Email passed!
  return true;
}
