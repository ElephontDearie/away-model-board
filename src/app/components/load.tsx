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

export const GrowSpinner = () => {
  return (
    <section className="text-end text-right">
      <Spinner animation='grow' size="sm"  style={{ height: "10px", width: "10px" }} className='mx-2'/>
      <Spinner animation='grow'  style={{ height: "25px", width: "25px" }} className='mx-2' />
      <Spinner animation='grow' style={{ height: "50px", width: "50px" }} className='mx-2' />
    </section>


  )
}


