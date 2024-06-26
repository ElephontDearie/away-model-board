import { BacklogNavigation, SprintList, LogoImage} from "./headerNav";
import UserBlock from "./userBlock";
import { CreateSprintButton } from "./sprint";
import "../sass/header.scss";


const Header = () => {
  return (
    <header className="p-3 bg-dark text-white">
      <div className="container">

        <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
          <a href="/" className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
              <LogoImage/>
          </a>

          <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
            <li className="px-1">
                <BacklogNavigation />
            </li>
            <li className="px-1">
              <SprintList />
            </li>
            <li className="px-1">
              <CreateSprintButton />
            </li>
            <li>
              <a href="/about" className="nav-link px-2 text-white">
                About
              </a>
            </li>
            <li>
              <a href="/" className="nav-link px-2 text-white">
                Home
              </a>
            </li>
          </ul>
        </div>

      </div>
      <UserBlock />
    </header>
  );
};

export default Header;