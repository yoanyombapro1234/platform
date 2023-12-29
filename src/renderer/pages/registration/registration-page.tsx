import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Logo } from "src/components/Logo";
import { CustomButton } from "src/components/button/custom-button";
import {
  BusinessAccountRegistrationForm,
  RegistrationForm,
} from "src/components/form/registration-form";
import { TermsAndConditions } from "src/components/terms-and-conditions/terms-and-conditions";
import { Button } from "src/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "src/components/ui/popover";
import { ScrollArea } from "src/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "src/components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "src/components/ui/tabs";
import { routes } from "src/constant/routes";

export default function RegistrationPage() {
  const history = useNavigate();
  const navigateToLoginPage = () => {
    history(`${routes.AUTHENTICATION}`);
  };

  return (
    <>
      <div className="w-screen container relative flex-col items-center justify-center h-screen md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative flex-col hidden h-full p-10 text-white bg-muted dark:border-r lg:flex">
          <div className="absolute inset-0 bg-black" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Logo className="text-2xl text-bold"></Logo>
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                Unleash the power of expert financial planning, tailored for
                solo entrepreneurs, all from the convenience of your fingertips.{" "}
              </p>
              <footer className="text-sm">Solomon AI</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-2 pt-[15%] flex flex-col justify-center items-center">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            {/** hide the logo on larger screen */}
            <Link
              to="/financial-portal"
              aria-label="Home"
              className="md:hidden"
            >
              <Logo />
            </Link>
            <Tabs defaultValue="account">
              <TabsList className="flex items-center justify-center bg-black">
                <TabsTrigger value="business">For Small Businesses</TabsTrigger>
                <TabsTrigger value="account">
                  For Solo Entrepreneurs
                </TabsTrigger>
              </TabsList>
              <TabsContent value="business" className="md:min-h-[70%] w-full">
                {/** Popover is only shown on large screens */}
                <div className="hidden sm:block border shadow-sm rounded-2xl ">
                  <Sheet>
                    <SheetTrigger asChild>
                      <div className="flex items-center justify-center border-0 ">
                        <Button variant="ghost">Lets Get Started</Button>
                        <ArrowRightCircleIcon className="w-6 h-6" />
                      </div>
                    </SheetTrigger>
                    <SheetContent className="md:min-w-[90%] overflow-y-scroll">
                      <ScrollArea>
                        <BusinessAccountRegistrationForm />
                      </ScrollArea>
                    </SheetContent>
                  </Sheet>
                </div>
                {/** This div is shown only on small screens */}
                <div className="block md:hidden flex items-center justify-center w-[100%] shadow-sm border rounded-2xl">
                  <BusinessAccountRegistrationForm />
                </div>
              </TabsContent>
              <TabsContent value="account" className="md:min-h-[70%]">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col space-y-2 text-center">
                    <p className="text-sm text-muted-foreground">
                      Enter your email below to create your account or
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <p className="col-span-2 text-sm text-muted-foreground">
                        Already have an account?
                      </p>
                      <CustomButton
                        onClickHandler={() => {
                          /* your navigation logic here */
                          navigateToLoginPage();
                        }}
                        isLoading={false}
                        label="Login"
                      />
                    </div>
                  </div>
                  {/** TODO: Remove This */}
                  <div className="md:min-w-[500px] border shadow-sm rounded-2xl">
                    <RegistrationForm />
                  </div>
                  <p className="px-8 text-sm text-center text-muted-foreground">
                    <div className="flex items-center justify-center flex-1 gap-2">
                      <TermsAndConditions
                        title="Terms of Service"
                        disableCheckbox={true}
                        className="underline underline-offset-4 hover:text-primary"
                      />
                      <TermsAndConditions
                        title="Privacy Policy"
                        disableCheckbox={true}
                        className="underline underline-offset-4 hover:text-primary"
                      />
                    </div>
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}
