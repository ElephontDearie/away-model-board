import { Spinner } from 'react-bootstrap';
import Image from 'next/image';

export const LoadingPage = () => {
  return (
    <main>
        <div className="d-flex justify-content-center align-items-center vh-100">
          <Spinner animation="border" variant="primary" />
          <Image
                src="/sprintLogo.svg"
                alt="board-logo"
                width={200}
                height={200}
                priority={true}
            />
        </div>

    </main>

  );
};
