import React from 'react';

function FriesMenu({ fries, FryClick }) {
  return (
    <div id="fries" className="fries-list">
      {fries.map((friesItem) => (
        <div className="fries-item" key={friesItem.id} onClick={() => FryClick(friesItem)}>

          <img src={`${process.env.PUBLIC_URL}/images/${friesItem.image}`} alt={friesItem.title} />
          <div className="fries-info">
            <h3>{friesItem.title}</h3>
            <h3 className="price-h3">{friesItem.price}</h3>
            <p>{friesItem.description}</p>
            
          </div>
        </div>
      ))}
    </div>
  );
}

export default FriesMenu;

