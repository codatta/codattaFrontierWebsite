import styled from 'styled-components'

const Button3D = styled.button`
  height: 46px;
  color: #1c1c26;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: inline-block;
  outline: none;
  border-radius: 36px;
  border-width: 2px 2px 6px 2px;
  border-style: solid;
  border-color: #323232;
  background: linear-gradient(180deg, #d6cafe 0%, #9e81fe 100%);
  background-size: 120% auto;

  box-shadow: 0px 1px 6px 0px #9e81fe;
  &:hover:enabled {
    box-shadow: 0 3px #9e81fe;
    top: 1px;
    background-position: right center;
  }

  &:active:enabled {
    box-shadow: 0 0 #9e81fe;
    top: 5px;
  }
  &[disabled] {
    cursor: not-allowed;
    box-shadow: none;
    background: #d6d6d6;
    color: #0500197d;
    border: 1px solid #d6d6d6;
  }
`

export default Button3D
