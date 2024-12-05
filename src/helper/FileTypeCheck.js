export const getFileType = url => {
  const pathArray = url.split('/');
  const fileName = pathArray[pathArray.length - 1];
  const extensionArray = fileName.split('.');
  const fileExtension = extensionArray[extensionArray.length - 1].toLowerCase();

  const videoExtensions = [
    'mp4',
    'mov',
    'avi',
    'mkv',
    'wmv',
    'flv',
    'webm',
    '3gp',
  ];
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp'];
  const documentExtensions = [
    'pdf',
    'doc',
    'docx',
    'ppt',
    'pptx',
    'xls',
    'xlsx',
    'txt',
  ];

  if (videoExtensions.includes(fileExtension)) {
    return 'video';
  } else if (imageExtensions.includes(fileExtension)) {
    return 'photo';
  } else if (documentExtensions.includes(fileExtension)) {
    return 'document';
  } else {
    return 'unknown';
  }
};
