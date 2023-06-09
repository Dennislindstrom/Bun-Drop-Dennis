import React from 'react';

function SodaMenu({ sodas, sodaClick }) {
  return (
    
    <div id="sodas" className="soda-list" >
      {sodas.map((soda) => (
        <div className="soda-item" key={soda.id} onClick={() => sodaClick(soda)}>
          <img
            src={`${process.env.PUBLIC_URL}/images/${soda.image}`}
            alt={soda.title}
          />
          <div className="soda-info">
            <h3>{soda.title}</h3>
            <h3 className="price-h3">{soda.price}</h3>
            <p>{soda.description}</p>
            
          </div>
          
        </div>
      ))}

      


    </div>
  );
}

export default SodaMenu;
