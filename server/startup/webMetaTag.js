import { onPageLoad } from 'meteor/server-render';

import { dbCompanies } from '/db/dbCompanies';

onPageLoad((sink) => {
  const { pathname } = sink.request.url;
  const companyId = extractCompanyId(pathname);
  const companyData = companyId ? getCompanyData(companyId) : null;

  let metaTag = getCommonMetaTag();
  if (companyData) {
    metaTag += getCompanyMetaTag(companyData);
  }
  else {
    metaTag += getDefaultMetaTag();
  }
  sink.appendToHead(metaTag);
});

function getCommonMetaTag() {
  let metaTag = '';
  metaTag += createMetaName('twitter:card', 'summary');
  metaTag += createMetaProperty('og:site_name', 'acgn-stock');
  metaTag += createMetaProperty('og:image:width', 300);
  metaTag += createMetaProperty('og:image:height', 300);

  return metaTag;
}

function getDefaultMetaTag() {
  let metaTag = '';
  metaTag += createMetaProperty('og:title', 'ACGN 股票交易市場');
  metaTag += createMetaProperty('og:image', 'https://acgn-stock.com/ms-icon-310x310.png');
  metaTag += createMetaProperty('og:description', '漲停!!');

  return metaTag;
}

function getCompanyMetaTag(companyData) {
  let metaTag = '';
  const { companyName, pictureSmall } = companyData;
  metaTag += createMetaProperty('og:title', companyName);
  metaTag += createMetaProperty('og:image', pictureSmall);
  metaTag += createMetaProperty('og:image:url', pictureSmall);
  metaTag += createMetaProperty('og:description', createCompanyDescription(companyData));

  return metaTag;
}


function createCompanyDescription({ listPrice, capital, totalValue, description }) {
  return `｜ 價格: ${listPrice} ｜ 市值: ${capital} ｜ 資本額: ${totalValue} ｜

    ${description}
  `;
}

function createMetaProperty(property, content) {
  return `<meta property="${property}" content="${content}" />`;
}

function createMetaName(name, content) {
  return `<meta name="${name}" content="${content}" />`;
}


function getCompanyData(companyId) {
  return dbCompanies.findOne({ _id: companyId },
    {
      fileds: {
        companyName: 1,
        pictureSmall: 1,
        description: 1,
        listPrice: 1,
        capital: 1,
        totalValue: 1
      }
    });
}

function extractCompanyId(pathname) {
  const tripIdRegExp = new RegExp('/company/detail/([0123456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz]{17})');
  const match = pathname.match(tripIdRegExp);
  if (! match || match.length > 2) {
    return null;
  }

  return match[1];
}
