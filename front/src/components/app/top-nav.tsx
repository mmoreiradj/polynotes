import { Avatar, Button, Dropdown, Navbar } from 'flowbite-react'
import { useContext } from 'react'
import polyNotesLogo from '../../assets/logo.png'
import { UserContext, UserDispatchContext } from '../../stores/user/user.context'
import { Link } from 'react-router-dom'
import { authService } from '../../services'
import { UserActionType, isConnected } from '../../stores/user/user.reducer'

export function AppTopNav() {
  const user = useContext(UserContext)
  const dispatch = useContext(UserDispatchContext)

  const handleOnClick = async () => {
    await authService.logout()
    dispatch({
      type: UserActionType.EMPTY,
    })
  }

  return (
    <Navbar className={'border-b'} fluid>
      <Link to={`/home`} className="flex items-center">
        <img src={polyNotesLogo} className="mr-3 h-10 md:h-10" alt="Polynotes Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">PolyNotes</span>
      </Link>
      {isConnected(user) && (
        <div className="flex md:order-2">
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="User settings"
                img="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAQDxUPEBAVDxUPFRUVFRUVDw8PDxUVFRUWFhUVFRUYHSggGBolHRUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OFRAQFSsdHR0rLSsrKy0tLS0rKysrLS0rLS0tLSstLS0tKystKystLS0tLS0rLSsrKy0tLS0tLS0rN//AABEIARMAtwMBIgACEQEDEQH/xAAbAAEBAAMBAQEAAAAAAAAAAAAAAQIEBQMGB//EADcQAAIBAgQDBQcEAQQDAAAAAAABAgMRBAUhMRJBUSJhcYGRBhOhscHR8DJCUvFyFGKS4QcjM//EABkBAQEAAwEAAAAAAAAAAAAAAAABAgMEBf/EACIRAQEAAgIBBAMBAAAAAAAAAAABAhEDIRIEMUFRIjJxYf/aAAwDAQACEQMRAD8A/YykRTYBSFAAAigAAFIilQAAAAAAABSAACkKBCgEEYKQIxRSFKoAUCApCKAAAgAEAAUCkAFBABQAAKQACkAFIAQQApQAAAgAAhSEUKQAUgARQQFFBABSkCAoAAFIAAAIIUAoAACAACApCACAKoIAiggKKCFAFIAKUgAoAAAAACACgACABgQwq1YxV5SS/ORz8ZmluzT1/wB3LyXM5VSbk7ttvvN2HDb79Lp1q2bRX6YuXe9Eak80qva0fBfc0iG6cWM+BsvHVf5v4IixtX+b9TR/1VPj93xx4/48S4vQ9jLxx+lb0MyqrmpeKX0Nmlmy/dG3etV6HOw9Lierslue+Pwfu7NO6l6muzjuXj8o7NGvGesZJ/PzR6Hy8ZNO6dn1WjOlhM0/bU/5L6o15cNnt2OuCRkmrrW/oU0oFIUAUgAoBAAIUAUgAkpJK7dkt2cHMcwdTsx0j8Zd7+xnm+N4n7uP6Y797+yOcdXFx67qqikQNyhzPaLM/wDS4adWzbWkVa/aex0j5r27jehBv9Mal3rbXhdjHkusbUc/2Hw8atSVeV5Tu3xNPW+7u/A+3lLW/U/M/ZrFyVeDUnGPO7032fXW3qfpUVey/LI4+HPxtt+lxnTYwtLiavsnfxt/ZtZxK8o9FH6mVKlsttro880esV3fUcFt5N35ZZNAhSHcwbeBxzpu28Xuunejv05qSUou6ezPlDeyvGe7lwyfZl8H1NPLx77nuO+UgOVFAAAAAQpABTTzTFe7p6fqlou7qzcPm84xHHVa5Q7K8efx+Rs4sfLIaiLcxRTtZMkCIAU4/tbS4sHUXNcLXKzUkfUYXKnJXlLh7t2bE8koyThUvVT3T0i13mjk5cNWbR+S4TJ6kKlN02qs4ytKC1i4PW99tmfqWVYaUY9pWdkrb2tc6tHA0ofpgl4JJGxKmracjh0sunjwq3ecfN5L3iX8Ul9fqdKFR8Wuhx8wTVWV+tzo9PN5DXIwRnaiAMgHfyfE8cOF7w+K5fY6J8xl9fgqKXLZ+D/L+R9OcfNj45f1AFBqAhQBiAAMatThi5P9qb9Fc+P4m3d7s+mzidqEu+y9XY+YR1ennVqxmimKKjoVkjay+lxSvbSPz5GtFXdju4TRJJaHPz8njNfZHvG9jGdXhuzY4bnOzmnUcOwr3dnbez3OGrO6+Or/APkWPvpxVJyp0r3kppOymoOVunE189tT7jLscqsFKN7SSa80fiOYew2NeJnGMKnBVlJ3g0o8E3dwld7eXJH7XkmD9zRp03r7uEY+iMZUyjZ93rexyc3glO6i9d2728uR9Gop/wBmhmGXe81TS8r/ABN/FlMcu2O3zhDKpGza6GLPQVGQMFA+pwFXjpRl1WvitH8j5Y+gyKV6Vv4ya+T+po55+O0dEApyCAoAxIABz8+/+D/yj8z5tH02dRvQl3WfpJHzCOvg/VY9EUwTMjcr2pVFHtPl/R1ctzOjW4oxmpOFuKzvZy5HAxlPipTjveEvW2ljW9laEKN1Ti48TvLid5N9553qcrOSfTdjjjeO35fccdldHpTqJ6M1KctPzXRHiqzvY1W6aNbdThXiYu1v+jVhiHfvPSNZyMfI02absZs84R6nsZRHBx2VSu5QSt0u7nKlFrRqx9o4nOzPAKcbpdpHXx89nWRt8yCyVnZ8iHWqnc9n/wBEv8vojhnfyGP/AKm+sn8EjVz/AKI6QKDiRAUBXmCmLKPLFU+OEo/yi18D49H2jPlc1ocFaS5S7S89/jc6PT5d2LGujIwRmdSs4/n3JpTvPnyWwTPSME99behxeqnUrPBu4TMYNWbtblbVcj0eIi5Wjq1vZN2PDD0I21X33N+MUtErHD3VskvRCi5K7fD53N6nZbGqpmdOppcskjXW3Kpax6wmaqmmrPmEzJi3lISR405HrcyiObmOUxmnKOkvHRnztWm4uz0aPtkcnOcEpLi2aOni5rOr7K+dTPqMrp8NGK6q/q7/AFPm8NQc6ih1dn4c36H1yRs9Rl1IVQAcqAAAwIzIjKrBnMzvC8cOJLWGvlzX18jqM85Fxy8buD45GZt5pg/dyvFdmW3c+hpnfMplNxWaZk3ZowQmc3q5+MbMPdv0Kn58jYjO5y6U/h+I2qVdL+jz9s8sW3UfJeJ6qrproaNWSlpu3z2LTSS538SeXbDxdKlJ80e8JOxpYesmtj1hUNka7G5TnqbKehz4yNmFTQyiNhM8MZLsM9E9DWrr3nYW37u5fcqNXJ8NvVa30j4c3+dDqmMYpKy0S0SMjJQABAAoGLIykAwZi0ejMWiq161JSTjJXTPnMdgpUnrrF7P6PvPqbGNSkpJxkrp7p7Gzj5Lhf8HyKEtvkdPG5TKOtPtLp+5eHU5j5nRnrkwumUvbCE1t0Nuj1WvdqeGHo8TOtQwT6fc8jLG7dHlNPPhT6no6fTW56ulYqdvASNdv08oUWt9L8l0PeMWX3icrI2YQS7/Izka68oUnfU2qMCwcT0ur6GyRislpZblhCysipFMtIAAoAAAUgAEKAMbEsZEAxsQyZiyqjNHMKFOSvKOvVaS9TbnI5OZV9BvSyNbAxipNLVI72Gkj5vAz1fkdzDztboads8o28RRT7mfL491YT4IR4uJ2VmtNea5I7+JxW7T0+RqYWF3x232MbJkwm49cuwjhHtO8nu+XkdGEbHjSk0bKmZ4wteMoXZ6U4WLFfEyNkmmIUgAoIUAAAAAAAACAEYEZhJmbPKZVa+InocDH1bs7eJi2jlzwLkzDJni5+FqWlfuOrg8YpK1n2dHp+dRQy5LV6mdaiorsq3gjXcLWVyjyxeJWlNa3+B0cNUUUuRwqWGm58XQ6kaEna/L520MZjZ7RjdOhLEKPnyPWjJvVnjh8OtL62NtI3Yy/LCqADJFBCgUEAFAAAEAApClEDAIMWjGSM2YsDwnE81TPeSCiVXnGBjUpmykRxINaFI9o0zOMD0SAkYlKAiAAAAAKCACggKKCACghQKQACMxZkyEGNipFsUCCxSgEikAAhSFAgAAEAFBLgClIAikBAMkDG5QMiABUAYAFIAKUxLcAAABARgAQAUEARQS5AKUxAGQMbgCoqAAoAAAgChSAAAAKCAIpGABiACgAABEUACAAY3AAH//Z"
                rounded
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">{user?.name}</span>
              <span className="block truncate text-sm font-medium">{user?.email}</span>
            </Dropdown.Header>

            <Dropdown.Item onClick={handleOnClick}>Sign out</Dropdown.Item>
          </Dropdown>
        </div>
      )}
      {!isConnected(user) && (
        <div className="flex flex-row items-center">
          <Link to="/login" replace>
            <Button color="purple" className="mr-2">
              Login
            </Button>
          </Link>
          <Link to="/register" replace>
            <Button color="purple" className="mr-2">
              Register
            </Button>
          </Link>
        </div>
      )}
    </Navbar>
  )
}
