import React from 'react';
import { IntlContextConsumer, changeLocale } from 'gatsby-plugin-react-intl';
import { useIntl, Link } from 'gatsby-plugin-react-intl';

const Language = ({ en = true, ja = true } = {}) => {
  // 多言語設定
  const intl = useIntl();
  // 公開設定
  const publish_setting = {
    en: en,
    ja: ja
  };
  return (
    <dl
      className="c-descriptionList"
      style={{
        fontSize: `14px`,
        display: `flex`,
        flexWrap: `wrap`
      }}
    >
      <dt
        className="c-descriptionList_term"
        style={{
          fontSize: `14px`,
          fontWeight: `normal`
        }}
      >
        {intl.formatMessage({ id: 'sitesetting.text.switch' })}:
      </dt>
      <IntlContextConsumer>
        {({ languages, language: currentLocale }) =>
          languages.map((language, index) => {
            let languageStyle = {};
            languageStyle.paddingLeft = `1em`;
            languageStyle.fontSize = `14px`;
            languageStyle.fontWeight =
              currentLocale === language ? `bold` : `normal`;
            if (publish_setting[language]) {
              languageStyle.cursor = `pointer`;
              return (
                <dd className="c-descriptionList_detail" key={index}>
                  <a
                    key={language}
                    onClick={() => changeLocale(language)}
                    className="c-link"
                    style={languageStyle}
                  >
                    {publish_setting[language]}
                    {intl.formatMessage({ id: 'sitesetting.text.' + language })}
                  </a>
                </dd>
              );
            } else {
              languageStyle.cursor = `auto`;
              return (
                <dd className="c-descriptionList_detail" key={index}>
                  <span
                    key={language}
                    //onClick={() => changeLocale(language)}
                    className="c-link"
                    style={languageStyle}
                  >
                    {publish_setting[language]}
                    {intl.formatMessage({ id: 'sitesetting.text.' + language })}
                  </span>
                </dd>
              );
            }
          })
        }
      </IntlContextConsumer>
    </dl>
  );
};

export default Language;
