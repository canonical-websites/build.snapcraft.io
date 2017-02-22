import React, { PropTypes } from 'react';

import style from './testimonial.css';

export default function Testimonial(props) {
  const { logo='/static/icons/d48f3adfb2f375147da21922f104bc1b.svg', citation='Virgil', ...rest } = props;
  return (
    <div>
      <blockquote className={ style.pullQuote }>
        <p>{ props.children }</p>
      </blockquote>
      <cite className={ style.pullQuoteCitation }>
        <span className={ style.pullQuoteLogo }><img src={ props.logo } alt='logo'/></span> { props.citation }
      </cite>
    </div>
  );
}

Testimonial.propTypes = {
  logo: PropTypes.string,
  citation: PropTypes.string,
  children: PropTypes.string
};
