import React from "react";
import BreadCrumb from "../components/BreadCrumb";
import Container from "../components/Container";
import Meta from "../components/Meta";

const ShippingPolicy = () => {
  return (
    <>
      <Meta title={"Shippingg Policy"} />
      <BreadCrumb title="Shippingg Policy" />
      <Container class1="policy-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <div className="policy">
            <h4 className="text-center">Shipping Policy</h4>
              <p className="text-center"><h6>The following are some conditions.</h6><br/>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem vitae voluptates ipsum vel accusantium illum amet expedita ut explicabo ad dicta facilis distinctio, delectus nostrum, aliquam necessitatibus recusandae libero itaque necessitatibus recusandae libero itaque necessitatibus recusandae libero itaque necessitatibus recusandae libero itaque.
              </p>
            </div>
            </div>
          </div>
      </Container>
    </>
  );
};

export default ShippingPolicy;