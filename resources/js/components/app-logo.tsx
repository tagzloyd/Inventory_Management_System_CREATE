import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex h-10 w-8 items-center justify-center rounded-md ">
                <AppLogoIcon />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">Inventory Management System</span>
            </div>
        </>
    );
}
    