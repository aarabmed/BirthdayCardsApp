import React from "react";
import { Row, Col } from "antd";

import Container from "../other/Container";

function Footer({ containerType }) {
  return (
    <div className="footer">
      <div className="footer-bottom">
        <Container type={containerType} cName='container-admin'>
          <p>Copyright © 2021 Orenji Inc. All rights reserved</p>
        </Container>
      </div>
    </div>
  );
}

export default React.memo(Footer);
