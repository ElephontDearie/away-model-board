import Image from "next/image";
import { BacklogNavigation, SprintList, LogoNavigation} from "./headerNav";
import "../sass/header.scss";
import UserBlock from "./userBlock";
const Header = () => {
    // const router = useRouter();

  
      return (
        <header className="p-3 bg-dark text-white">
          <div className="container">
  
            <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
              <a
                href="#"
                className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none"
              >
                <LogoNavigation/>
              </a>
    
              <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
                <li className="px-1">
                    <BacklogNavigation />
                </li>
                <li className="px-1">
                  <SprintList />
                  {/* <a href="#" className="nav-link px-2 text-white">
                    Past Sprints
                  </a> */}
                </li>
                <li>
                  <a href="#" className="nav-link px-2 text-white">
                    About
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