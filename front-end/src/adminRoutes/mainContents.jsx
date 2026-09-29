import { Outlet } from "react-router-dom";



function MainContents() {
    return (
        <>
            <div className='w-full'>
                <Outlet />
            </div>
        </>
    );
}

export default MainContents
