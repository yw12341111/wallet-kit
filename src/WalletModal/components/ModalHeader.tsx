import iconClose from '../../imgs/icon_close.svg'
import logo from '../../imgs/logo.svg'


const ModalHeader = ({
  hanldeCloseConnectModal
}: { hanldeCloseConnectModal:()=>void}) => {
  return (
    <div className="header">
      <img className="close" onClick={hanldeCloseConnectModal} src={iconClose} alt="close" />
      <img className="logo" src={logo}/>
      <span>Connect your account now and start exploring</span>
    </div>
  )
}

export default ModalHeader