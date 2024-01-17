import polyNotesLogo from '../../assets/logo.png'

export const ErrorPage = () => {
  return (
    <div className={'flex flex-col items-center'}>
      <img src={polyNotesLogo} className={'large-logo'} alt="Polynotes Logo" />
      <h1>Error 404</h1>
      <p>We couldn't find what you were looking for !</p>
    </div>
  )
}
