import { useCheckEmailExistsMutation } from "src/redux/mutations/check-email-exists";
import { useCheckUsernameExistsMutation } from "src/redux/mutations/check-username-exists";
import React, { useState } from "react";
import { AvalailabeTagSet } from "src/constant/tags";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  CreateAccountRequestClass,
  UserRegistrationAccountDetails,
  Tags,
  CreateAccountV2RequestClass,
} from "@solomon-ai/component-library";
import { mixPanelClient } from "src/lib/mixpanel";
import { routes } from "src/constant/routes";
import { cn, randomIntFromInterval } from "src/lib/utils";
import {
  useCreateAccountMutation,
  useCreateAccountV2Mutation,
} from "src/redux/mutations/create-account";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Avatar } from "../ui/avatar";
import { Button } from "../ui/button";
import { TermsAndConditions } from "../terms-and-conditions/terms-and-conditions";
import HappyToast from "../happy-toast";
import Toast from "../warning-toast";
import { MultiStepCreateBusinessAccountForm } from "./create-business-account-form/CreateBusinessAccountForm";

// generate a set of avatar urls to choose from
const lowerbound = randomIntFromInterval(1, 45);
const upperbound = lowerbound + 15;
const avatarUrlSet: string[] = [];
for (let i = lowerbound; i < upperbound; i++) {
  avatarUrlSet.push(
    `https://d278s71ylmkd61.cloudfront.net/profile-image-${i}.png`
  );
}

/**
 * RegistrationForm is a React functional component for an authentication page with email and
 * password input fields, and options to authenticate a user into the application
 * @param {RegistrationFormProps} props
 * @returns
 */
const RegistrationForm: React.FC = () => {
  const [createUserAccount] = useCreateAccountMutation();
  const [checkIfEmailExists] = useCheckEmailExistsMutation();
  const [checkUsernameExists] = useCheckUsernameExistsMutation();
  const navigate = useNavigate();
  const [toast, setToast] = useState<React.ReactElement | null>();
  const [interest, setInterest] = React.useState<Tags[]>([]);
  const [selectedAvatar, setSelectedAvatar] = React.useState<string>("");
  const [termsApproved, setTermsApproved] = React.useState<boolean>(false);

  const onSelectTag = (tagName: string) => {
    const item = AvalailabeTagSet.find((tag) => {
      return tag.tagName === tagName;
    });

    if (item) {
      if (interest.includes(item)) {
        setInterest(
          interest.filter((interest) => {
            return interest !== item;
          })
        );
      } else {
        setInterest([...interest, item]);
      }
    }
  };

  /**
   * onSelectAvatar - sets the selected avatar
   * @param avatar
   */
  const onSelectAvatar = (avatar: string) => {
    setSelectedAvatar(avatar);
  };

  /**
   * checkBoxCallback - sets the terms approved
   */
  const checkBoxCallback = () => {
    setTermsApproved(true);
  };

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<CreateAccountRequestClass>({
    defaultValues: {
      account: {
        email: "",
        username: "",
        tags: [],
      },
      password: "",
      profileImage: "",
      communityIdsToFollow: [],
    },
  });

  /**
   * onSubmit - handles the submit of the form
   * @param req - the create account request
   * @returns
   * @throws
   */
  const onSubmit = async (req: CreateAccountRequestClass) => {
    try {
      // user must select an avatar
      if (selectedAvatar === "") {
        throw new Error("Please select an avatar");
      }

      // user must select atleast 3 interests
      if (interest.length < 3) {
        throw new Error("Please select atleast 3 interests");
      }

      // TODO: before we submit the payload to the backend we need to ensure the email and username does not already exist
      const email = req.account!.email.trim().toLocaleLowerCase();
      const username = req.account!.username.trim().toLocaleLowerCase();
      const password = req.password.trim();

      // call the backend and check if the email already exists
      // const emailExists = await checkEmailExists({ email: email }).unwrap();
      const res = await checkIfEmailExists({
        email: email,
        profileType: "PROFILE_TYPE_USER",
      }).unwrap();
      if (res.exists) {
        throw new Error(
          "Email already exists. Please use another email or log in with the current email ! "
        );
      }

      // call the backend and check if the username already exists
      const usernameExists = await checkUsernameExists({
        username: username,
        profileType: "PROFILE_TYPE_USER",
      }).unwrap();
      if (usernameExists.exists) {
        throw new Error("Username already exists");
      }

      if (termsApproved === false) {
        throw new Error("Terms and conditions not approved");
      }

      const acct = new UserRegistrationAccountDetails({
        email: email,
        username: username,
        tags: interest,
      });

      const createAccountRequestClass = new CreateAccountRequestClass({
        account: acct,
        password: password,
        profileImage: selectedAvatar,
        communityIdsToFollow: req.communityIdsToFollow,
      });

      // call the backend and register the user
      const newAcct = await createUserAccount({
        body: createAccountRequestClass,
      }).unwrap();

      // increment a mixpanel registration event
      mixPanelClient.trackRegistrationEvent({
        userID: `${newAcct.userId}`,
        time: new Date().toDateString(),
        metaData: {
          userName: `${username}`,
          tags: interest,
        },
      });
      setToast(
        <HappyToast
          show={true}
          message={
            "Account has been created! Check your email for a verification email :) "
          }
          autoHideDuration={3000}
        />
      );
      reset();

      // route the person to the authentication page
      setTimeout(function () {
        navigate(routes.AUTHENTICATION);
      }, 2000);
    } catch (error: any) {
      // dispatch an error toast
      setToast(
        <Toast
          show={true}
          message={error.message}
          autoHideDuration={3000}
          key={Date.now().toString()}
        />
      );
    }
  };

  return (
    <>
      {toast}
      <div className="py-8 m-6 bg-white min-w-lg rounded-2xl sm:px-10">
        <form className="space-y-3 form" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-1">
            <Label className="text-sm font-bold">Email</Label>
            <Input
              type="email"
              {...register("account.email", {
                required: "Must provide a valid email",
              })}
              placeholder={"Email"}
              title="Email"
            />
            <Label color={"danger"} className="text-xs">
              {errors.account?.email?.message}
            </Label>
          </div>
          <div className="grid gap-1">
            <Label className="text-sm font-bold">Username</Label>
            <p className="text-xs text-muted-foreground">
              Username must be at least 10 characters long
            </p>
            <Input
              {...register("account.username", {
                required: true,
                minLength: {
                  value: 10,
                  message: "Username must be at least 10 characters long",
                },
              })}
              placeholder={"Username"}
              title="Username"
            />
            <Label color={"danger"} className="text-xs">
              {errors.account?.username?.message}
            </Label>
          </div>
          <div>
            <Label className="text-sm font-bold">Password</Label>
            <p className="text-xs text-muted-foreground">
              Password must be at least 10 characters long
            </p>
            <Input
              title={"Password"}
              placeholder={"Password"}
              step={""}
              type="password"
              {...register("password", {
                required: true,
                minLength: {
                  value: 10,
                  message: "Password must be at least 10 characters long",
                },
              })}
            />{" "}
            <Label color={"danger"} className="text-xs">
              {errors.password?.message}
            </Label>
          </div>

          <div className="flex flex-col">
            <TagsSelector onSelectTags={onSelectTag} selectedTags={interest} />
            <AvatarSelector
              onSelectAvatar={onSelectAvatar}
              selectedAvatar={selectedAvatar}
            />
            <TermsAndConditions callback={checkBoxCallback} />
            <div className="flex items-center justify-center pt-8">
              <Button
                type="submit"
                variant={"outline"}
                color="dark"
                className="w-full font-bold bg-white border rounded-full"
              >
                Create An Account
              </Button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

/**
 * BusinessAccountRegistrationForm is the form used to onbaord businesses
 * @returns
 */
const BusinessAccountRegistrationForm: React.FC<{
  className?: string;
}> = ({ className }) => {
  const [createUserAccount] = useCreateAccountV2Mutation();
  const [checkIfEmailExists] = useCheckEmailExistsMutation();
  const [checkUsernameExists] = useCheckUsernameExistsMutation();
  const navigate = useNavigate();
  const [toast, setToast] = useState<React.ReactElement | null>();
  const [interest, setInterest] = React.useState<Tags[]>([]);
  const [selectedAvatar, setSelectedAvatar] = React.useState<string>("");
  const [termsApproved, setTermsApproved] = React.useState<boolean>(false);

  const onSelectTag = (tagName: string) => {
    const item = AvalailabeTagSet.find((tag) => {
      return tag.tagName === tagName;
    });

    if (item) {
      if (interest.includes(item)) {
        setInterest(
          interest.filter((interest) => {
            return interest !== item;
          })
        );
      } else {
        setInterest([...interest, item]);
      }
    }
  };

  /**
   * checkBoxCallback - sets the terms approved
   */
  const checkBoxCallback = () => {
    setTermsApproved(true);
  };

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<CreateAccountRequestClass>({
    defaultValues: {
      account: {
        email: "",
        username: "",
        tags: [],
      },
      password: "",
      profileImage: "",
      communityIdsToFollow: [],
    },
  });

  /**
   * onSubmit - handles the submit of the form
   * @param req - the create account request
   * @returns
   * @throws
   */
  const onSubmit = async (req: CreateAccountV2RequestClass) => {
    try {
      // user must select an avatar
      if (selectedAvatar === "") {
        throw new Error("Please select an avatar");
      }

      // user must select atleast 3 interests
      if (interest.length < 3) {
        throw new Error("Please select atleast 3 interests");
      }

      if (req.businessAccount === undefined) {
        throw new Error("Business account details are missing");
      }

      if (req.password === undefined) {
        throw new Error("Password is missing");
      }

      if (req.businessAccount.email === undefined) {
        throw new Error("Email is missing");
      }

      // TODO: before we submit the payload to the backend we need to ensure the email and username does not already exist
      const email = req.businessAccount!.email!.trim().toLocaleLowerCase();
      const username = req
        .businessAccount!.username!.trim()
        .toLocaleLowerCase();
      req.password = req.password.trim();

      // call the backend and check if the email already exists
      // const emailExists = await checkEmailExists({ email: email }).unwrap();
      const res = await checkIfEmailExists({
        email: email,
        profileType: "PROFILE_TYPE_BUSINESS",
      }).unwrap();
      if (res.exists) {
        throw new Error(
          "Email already exists. Please use another email or log in with the current email ! "
        );
      }

      // call the backend and check if the username already exists
      const usernameExists = await checkUsernameExists({
        username: username,
        profileType: "PROFILE_TYPE_BUSINESS",
      }).unwrap();

      if (usernameExists.exists) {
        throw new Error("Username already exists");
      }

      if (termsApproved === false) {
        throw new Error("Terms and conditions not approved");
      }

      req.businessAccount.tags = interest;

      // call the backend and register the user
      const newAcct = await createUserAccount({
        body: req,
      }).unwrap();

      // increment a mixpanel registration event
      mixPanelClient.trackRegistrationEvent({
        userID: `${newAcct.userId}`,
        time: new Date().toDateString(),
        metaData: {
          userName: `${username}`,
          tags: interest,
        },
      });

      setToast(
        <HappyToast
          show={true}
          message={
            "Business Account has been created! Check your email for a verification email :)"
          }
          autoHideDuration={3000}
        />
      );
      reset();

      // route the person to the authentication page
      setTimeout(function () {
        navigate(routes.BUSINESS_AUTHENTICATION);
      }, 2000);
    } catch (error: any) {
      // dispatch an error toast
      setToast(
        <Toast
          show={true}
          message={error.message}
          autoHideDuration={3000}
          key={Date.now().toString()}
        />
      );
    }
  };

  return (
    <>
      {toast}
      <div
        className={cn(
          "w-fit h-full py-8 m-6 bg-white rounded-2xl sm:px-10 border-0",
          className
        )}
      >
        <MultiStepCreateBusinessAccountForm
          callback={onSubmit}
          className="w-fit border-0 shadow-none"
        />
        <div className="flex flex-col">
          <TermsAndConditions callback={checkBoxCallback} />
        </div>
      </div>
    </>
  );
};

/*
 * TagsSelector Component
 *
 * This component allows users to select from a set of tags.
 *
 * @component
 *
 * @param {Object} props
 * @param {(tagName: string) => void} props.onSelectTags - Callback function that is triggered when a tag is selected.
 * @param {Tags[]} props.selectedTags - Array of currently selected tags.
 *
 * @example
 *
 * <TagsSelector onSelectTags={handleTagSelect} selectedTags={[{tagName: "Nature"}, {tagName: "Sports"}]} />
 */
const TagsSelector: React.FC<{
  onSelectTags: (tagName: string) => void;
  selectedTags: Tags[];
}> = ({ onSelectTags, selectedTags }) => {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          {" "}
          <Label color="dark" className="text-xs font-bold">
            <p className="text-sm font-semibold"> Pick 3 interests 😀</p>
          </Label>
        </AccordionTrigger>
        <AccordionContent>
          <div slot="content" className="flex flex-wrap gap-2 py-2">
            {AvalailabeTagSet.map((item, idx) => {
              if (item.tagName === undefined) return null;

              return (
                <Button
                  onClick={() => onSelectTags(item.tagName!)}
                  className={
                    selectedTags.includes(item)
                      ? "bg-black text-white font-bold border"
                      : "bg-white text-black font-bold border"
                  }
                  key={idx}
                >
                  <p className="text-xs font-semibold">{item.tagName}</p>
                </Button>
              );
            })}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

/**
 * AvatarSelector Component
 *
 * This component allows users to select an avatar from a set of options.
 *
 * @component
 *
 * @param {Object} props
 * @param {(avatar: string) => void} props.onSelectAvatar - Callback function that is triggered when an avatar is selected.
 * @param {string} props.selectedAvatar - The URL of the currently selected avatar.
 *
 * @example
 *
 * <AvatarSelector onSelectAvatar={handleSelect} selectedAvatar="https://example.com/avatar1.png" />
 */
const AvatarSelector: React.FC<{
  onSelectAvatar: (avatar: string) => void;
  selectedAvatar: string;
}> = ({ onSelectAvatar, selectedAvatar }) => {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          {" "}
          <Label color="dark" className="text-xs font-bold">
            <p className="text-sm font-semibold"> Select an avatar 😀</p>
          </Label>
        </AccordionTrigger>
        <AccordionContent>
          <div slot="content" className="flex flex-wrap gap-2 py-2">
            {avatarUrlSet.map((avatarUrl, idx) => {
              return (
                <div
                  onClick={() => onSelectAvatar(avatarUrl)}
                  key={idx}
                  className="p-2"
                >
                  <Avatar>
                    <img
                      src={avatarUrl}
                      alt="avatar"
                      className={cn(
                        selectedAvatar === avatarUrl
                          ? "bg-white border border-black"
                          : "bg-white ",
                        "object-cover rounded-3xl w-10 h-10 md:h-auto md:w-16 md:rounded-none md:rounded-l-lg"
                      )}
                    />
                  </Avatar>
                </div>
              );
            })}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export { RegistrationForm, BusinessAccountRegistrationForm };
