import React from 'react';

const Currency = (props) => {
  const { changeAmount, swedishSek, localValue, sekValue, localCurrency, localCurRate } = props
  return (

    <div className="currency">
      <div >
        <span>{swedishSek.code} {swedishSek.symbol}</span>
        <input type="number" value={sekValue}
          onChange={(e) => {changeAmount(e, 'A');
          }} />
        <span>{sekValue.code}</span>
      </div>
      <div >
        <span >
          {localCurrency ? localCurrency.code + " " + localCurrency.symbol : "  $"}
        </span>
        <input type="number" value={localValue}
          onChange={(e) => { changeAmount(e, 'B');
          }} />
        <span className="">{sekValue.code}</span>
      </div>

    </div>

  );
}

export default Currency;

