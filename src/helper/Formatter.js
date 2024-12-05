import moment from 'moment';

export const calculateTimeDifference = timestamp => {
  const postTime = new Date(timestamp * 1000);
  const currentTime = new Date();

  const timeDifference = currentTime - postTime;
  const secondsDifference = Math.floor(timeDifference / 1000);

  if (secondsDifference < 60) {
    return 'a few seconds ago';
  } else if (secondsDifference < 3600) {
    const minutesDifference = Math.floor(secondsDifference / 60);
    return `${minutesDifference} minute${minutesDifference > 1 ? 's' : ''} ago`;
  } else if (secondsDifference < 86400) {
    const hoursDifference = Math.floor(secondsDifference / 3600);
    return `${hoursDifference} hour${hoursDifference > 1 ? 's' : ''} ago`;
  } else if (secondsDifference < 604800) {
    const daysDifference = Math.floor(secondsDifference / 86400);
    return `${daysDifference} day${daysDifference > 1 ? 's' : ''} ago`;
  } else if (secondsDifference < 2629746) {
    // approximately 30.44 days in a month
    const weeksDifference = Math.floor(secondsDifference / 604800);
    return `${weeksDifference} week${weeksDifference > 1 ? 's' : ''} ago`;
  } else if (secondsDifference < 31556952) {
    // approximately 365.25 days in a year
    const monthsDifference = Math.floor(secondsDifference / 2629746);
    return `${monthsDifference} month${monthsDifference > 1 ? 's' : ''} ago`;
  } else {
    const yearsDifference = Math.floor(secondsDifference / 31556952);
    return `${yearsDifference} year${yearsDifference > 1 ? 's' : ''} ago`;
  }
};
export const getLastSeenTimestamp = lastSeenTimestamp => {
  const now = moment();
  const lastSeenMoment = new Date(lastSeenTimestamp * 1000);
  const diffInMinutes = now.diff(lastSeenMoment, 'minutes');
  const diffInHours = now.diff(lastSeenMoment, 'hours');
  const diffInDays = now.diff(lastSeenMoment, 'days');
  const diffInWeeks = now.diff(lastSeenMoment, 'weeks');
  const diffInMonths = now.diff(lastSeenMoment, 'months');
  const diffInYears = now.diff(lastSeenMoment, 'years');
  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `Last seen ${diffInMinutes} minutes ago`;
  } else if (diffInHours < 24) {
    return `Last seen ${diffInHours} hours ago`;
  } else if (diffInDays === 1) {
    return 'Last seen yesterday';
  } else if (diffInDays < 7) {
    return `Last seen ${diffInDays} days ago`;
  } else if (diffInWeeks < 4) {
    return `Last seen ${diffInWeeks} weeks ago`;
  } else if (diffInMonths < 12) {
    return `Last seen ${diffInMonths} months ago`;
  } else {
    return `Last seen ${diffInYears} years ago`;
  }
};
export const formatText = text => {
  return text
    .split('<br>')
    .join('\n')
    .split('&amp;')
    .join('&')
    .split('&lt;')
    .join('<')
    .split('&gt;')
    .join('>')
    .split('&quot;')
    .join('"')
    .split('&nbsp;')
    .join(' ') // Replace non-breaking space with a regular space
    .split('&iexcl;')
    .join('¡')
    .split('&cent;')
    .join('¢')
    .split('&pound;')
    .join('£')
    .split('&curren;')
    .join('¤')
    .split('&yen;')
    .join('¥')
    .split('&brvbar;')
    .join('¦')
    .split('&sect;')
    .join('§')
    .split('&uml;')
    .join('¨')
    .split('&copy;')
    .join('©')
    .split('&reg;')
    .join('®')
    .split('&trade;')
    .join('™')
    .split('&ordf;')
    .join('ª')
    .split('&laquo;')
    .join('«')
    .split('&not;')
    .join('¬')
    .split('&shy;')
    .join('\u00AD') // Soft hyphen
    .split('&macr;')
    .join('¯')
    .split('&deg;')
    .join('°')
    .split('&plusmn;')
    .join('±')
    .split('&sup2;')
    .join('²')
    .split('&sup3;')
    .join('³')
    .split('&acute;')
    .join('´')
    .split('&micro;')
    .join('µ')
    .split('&para;')
    .join('¶')
    .split('&middot;')
    .join('·')
    .split('&cedil;')
    .join('¸')
    .split('&sup1;')
    .join('¹')
    .split('&ordm;')
    .join('º')
    .split('&raquo;')
    .join('»')
    .split('&frac14;')
    .join('¼')
    .split('&frac12;')
    .join('½')
    .split('&frac34;')
    .join('¾')
    .split('&iquest;')
    .join('¿')
    .split('&Agrave;')
    .join('À')
    .split('&Aacute;')
    .join('Á')
    .split('&Acirc;')
    .join('Â')
    .split('&Atilde;')
    .join('Ã')
    .split('&Auml;')
    .join('Ä')
    .split('&Aring;')
    .join('Å')
    .split('&AElig;')
    .join('Æ')
    .split('&Ccedil;')
    .join('Ç')
    .split('&Egrave;')
    .join('È')
    .split('&Eacute;')
    .join('É')
    .split('&Ecirc;')
    .join('Ê')
    .split('&Euml;')
    .join('Ë')
    .split('&Igrave;')
    .join('Ì')
    .split('&Iacute;')
    .join('Í')
    .split('&Icirc;')
    .join('Î')
    .split('&Iuml;')
    .join('Ï')
    .split('&ETH;')
    .join('Ð')
    .split('&Ntilde;')
    .join('Ñ')
    .split('&Ograve;')
    .join('Ò')
    .split('&Oacute;')
    .join('Ó')
    .split('&Ocirc;')
    .join('Ô')
    .split('&Otilde;')
    .join('Õ')
    .split('&Ouml;')
    .join('Ö')
    .split('&times;')
    .join('×')
    .split('&Oslash;')
    .join('Ø')
    .split('&Ugrave;')
    .join('Ù')
    .split('&Uacute;')
    .join('Ú')
    .split('&Ucirc;')
    .join('Û')
    .split('&Uuml;')
    .join('Ü')
    .split('&Yacute;')
    .join('Ý')
    .split('&THORN;')
    .join('Þ')
    .split('&szlig;')
    .join('ß')
    .split('&agrave;')
    .join('à')
    .split('&aacute;')
    .join('á')
    .split('&acirc;')
    .join('â')
    .split('&atilde;')
    .join('ã')
    .split('&auml;')
    .join('ä')
    .split('&aring;')
    .join('å')
    .split('&aelig;')
    .join('æ')
    .split('&ccedil;')
    .join('ç')
    .split('&egrave;')
    .join('è')
    .split('&eacute;')
    .join('é')
    .split('&ecirc;')
    .join('ê')
    .split('&euml;')
    .join('ë')
    .split('&igrave;')
    .join('ì')
    .split('&iacute;')
    .join('í')
    .split('&icirc;')
    .join('î')
    .split('&iuml;')
    .join('ï')
    .split('&eth;')
    .join('ð')
    .split('&ntilde;')
    .join('ñ')
    .split('&ograve;')
    .join('ò')
    .split('&oacute;')
    .join('ó')
    .split('&ocirc;')
    .join('ô')
    .split('&otilde;')
    .join('õ')
    .split('&ouml;')
    .join('ö')
    .split('&divide;')
    .join('÷')
    .split('&oslash;')
    .join('ø')
    .split('&ugrave;')
    .join('ù')
    .split('&uacute;')
    .join('ú')
    .split('&ucirc;')
    .join('û')
    .split('&uuml;')
    .join('ü')
    .split('&yacute;')
    .join('ý')
    .split('&thorn;')
    .join('þ')
    .split('&yuml;')
    .join('ÿ')
    .split('&#039;')
    .join("'");
};
export const calculateTimeDifferenceForComment = timestamp => {
  const postTime = new Date(timestamp * 1000);
  const currentTime = new Date();

  const timeDifference = currentTime - postTime;
  const secondsDifference = Math.floor(timeDifference / 1000);

  if (secondsDifference < 60) {
    return 'Online';
  } else if (secondsDifference < 3600) {
    const minutesDifference = Math.floor(secondsDifference / 60);
    return `${minutesDifference} m`;
  } else if (secondsDifference < 86400) {
    const hoursDifference = Math.floor(secondsDifference / 3600);
    return `${hoursDifference} h`;
  } else if (secondsDifference < 604800) {
    const daysDifference = Math.floor(secondsDifference / 86400);
    return `${daysDifference} d`;
  } else if (secondsDifference < 2629746) {
    // approximately 30.44 days in a month
    const weeksDifference = Math.floor(secondsDifference / 604800);
    return `${weeksDifference} w`;
  } else if (secondsDifference < 31556952) {
    // approximately 365.25 days in a year
    const monthsDifference = Math.floor(secondsDifference / 2629746);
    return `${monthsDifference} m`;
  } else {
    const yearsDifference = Math.floor(secondsDifference / 31556952);
    return `${yearsDifference} y`;
  }
};

export const timeFormat = timestamp => {
  const postTime = new Date(timestamp * 1000);
  const currentTime = new Date();

  const timeDifference = currentTime - postTime;
  const secondsDifference = Math.floor(timeDifference / 1000);

  if (secondsDifference < 60) {
    return 'a few seconds ago';
  } else if (secondsDifference < 3600) {
    const minutesDifference = Math.floor(secondsDifference / 60);
    return `${minutesDifference} min${minutesDifference > 1 ? 's' : ''} ago`;
  } else if (secondsDifference < 86400) {
    const hoursDifference = Math.floor(secondsDifference / 3600);
    return `${hoursDifference} hr${hoursDifference > 1 ? 's' : ''} ago`;
  } else if (secondsDifference < 604800) {
    const daysDifference = Math.floor(secondsDifference / 86400);
    return `${daysDifference} day${daysDifference > 1 ? 's' : ''} ago`;
  } else if (secondsDifference < 2629746) {
    // approximately 30.44 days in a month
    const weeksDifference = Math.floor(secondsDifference / 604800);
    return `${weeksDifference} week${weeksDifference > 1 ? 's' : ''} ago`;
  } else if (secondsDifference < 31556952) {
    // approximately 365.25 days in a year
    const monthsDifference = Math.floor(secondsDifference / 2629746);
    return `${monthsDifference} month${monthsDifference > 1 ? 's' : ''} ago`;
  } else {
    const yearsDifference = Math.floor(secondsDifference / 31556952);
    return `${yearsDifference} year${yearsDifference > 1 ? 's' : ''} ago`;
  }
};
