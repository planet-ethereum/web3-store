pragma solidity ^0.4.24;

contract Example {
  event ValueUpdated(uint value);

  uint value;

  function setValue(uint value_) public {
    value = value_;
    emit ValueUpdated(value_);
  }
}
