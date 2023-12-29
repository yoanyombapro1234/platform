import { useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { cn, enrichPaymentLink } from "src/lib/utils";
import { useAppSelector } from "src/redux/store/hooks";
import {
  selectCurrentUserAccount,
  selectUserFinancialProfile,
} from "src/redux/slice/authentication/AuthenticationSelector";
import { Logo } from "src/components/Logo";
import { constants } from "src/constant/constants";
import { Button } from "src/components/ui/button";

// Define a type for the price structure
type Price = {
  monthly: string;
  quarterly: string;
};

// Define a type for the main features, since they are strings, we can use string[]
type MainFeatures = string[];

// Define an interface for the Tier object structure
interface Tier {
  name: string;
  id: string;
  href: string;
  featured: boolean;
  description: string;
  price: Price;
  mainFeatures: MainFeatures;
}

// Since the features within sections can vary, we can use a Record type
// to represent an object with keys as tier names and values as either boolean or string
type TierAvailability = Record<string, boolean | string>;

// Define an interface for the Features within each section
interface Feature {
  name: string;
  tiers: TierAvailability;
}

// Define an interface for the Sections that contains a list of Features
interface Section {
  name: string;
  features: Feature[];
}

// Define an interface for the Frequency object structure
interface Frequency {
  value: string;
  label: string;
}

const frequencies: Frequency[] = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
];

/**
 * An array of objects representing the different payment tiers available for businesses.
 * Each object contains information about the tier's name, ID, description, price, and main features.
 */
const tiers: Tier[] = [
  {
    name: "Foundations",
    id: "bronze-tier",
    href: constants.BUSINESS_BRONZE_PACKAGE_FOUNDATIONS_PAYMENT_LINK,
    featured: false,
    description:
      "Ideal for budding entrepreneurs and small businesses seeking foundational insights. This package offers a gateway to understanding your financial landscape and setting the course for growth.",
    price: { monthly: "$159.99", quarterly: "$449.99" },
    mainFeatures: [
      "Basic AI-driven financial forecasting: Predict your revenue, expenses, and cash flows for the upcoming year.",
      "Budgeting tools: Efficiently allocate resources to maximize your startups potential",
      "Access to financial health metrics dashboard: Keep track of your key performance indicators",
    ],
  },
  {
    name: "Industry Titan",
    id: "gold-tier",
    href: constants.BUSINESS_GOLD_PACKAGE_INDUSTRY_TITAN_LINK,
    featured: true,
    description:
      "For businesses aiming to stand tall among industry leaders, the Industry Titan package is the key. Experience unmatched financial insights and guidance to make informed decisions confidently.",
    price: { monthly: "$349.99", quarterly: "$899.99" },
    mainFeatures: [
      "Strategy planning tools powered by AI: Align your business goals with the current market landscape",
      "Premium AI-driven financial forecasting: Granular insights including scenario analysis and risk assessments",
      "Full access to all Solomon-AI Compliance As A Service (CAAS) tools: Ensure your business is compliant with all relevant regulations",
      "Weekly Meetings: Discuss your financials and insights with the Solomon AI Teams",
    ],
  },
  {
    name: "Growth Catalyst",
    id: "silver-tier",
    href: constants.BUSINESS_GOLD_PACKAGE_INDUSTRY_TITAN_LINK,
    featured: false,
    description: "A plan that scales with your rapidly growing business.",
    price: { monthly: "$449.99", quarterly: "$1199.99" },
    mainFeatures: [
      "Advanced AI-driven financial forecasting: Deep-dive into multi-year projections",
      "Dedicated financial insights dashboard with customization: View KPIs tailored to your specific business model.",
      "Conversationally interact with any piece of your data",
      "Cash flow management tools: Ensure you are in a stable financial position as you scale",
    ],
  },
];

const sections: Section[] = [
  {
    name: "Catered for business",
    features: [
      {
        name: "Actionable Financial Insights",
        tiers: { Starter: true, Scale: true, Growth: true },
      },
      {
        name: "Conversational Accounting",
        tiers: { Starter: false, Scale: true, Growth: true },
      },
      {
        name: "Multi-accounts",
        tiers: {
          Starter: "2 accounts",
          Scale: "7 accounts",
          Growth: "3 accounts",
        },
      },
      {
        name: "Cash flow management tools",
        tiers: { Starter: false, Scale: true, Growth: true },
      },
      {
        name: "Solomon AI Compliance As A Service (CAAS)",
        tiers: { Starter: false, Scale: true, Growth: true },
      },
      {
        name: "Solomon AI Business Risk Assessor",
        tiers: { Starter: false, Scale: false, Growth: true },
      },
      {
        name: "Meetings with Solomon AI Team",
        tiers: {
          Starter: "Monthly Meetings",
          Scale: "Bi-Weekly Meetings",
          Growth: "Weekly Meetings",
        },
      },

      {
        name: "Exclusive offers",
        tiers: { Starter: false, Scale: true, Growth: true },
      },
      {
        name: "6 months free advisor (Solomon AI Model X)",
        tiers: { Starter: false, Scale: true, Growth: true },
      },
      {
        name: "Mobile and web access",
        tiers: { Starter: false, Scale: true, Growth: false },
      },
    ],
  },
  {
    name: "Other perks",
    features: [
      {
        name: "24/7 customer support",
        tiers: { Starter: true, Scale: true, Growth: true },
      },
      {
        name: "Instant notifications",
        tiers: { Starter: true, Scale: true, Growth: true },
      },
      {
        name: "Budgeting tools",
        tiers: { Starter: true, Scale: true, Growth: true },
      },
      {
        name: "Pots to separate money",
        tiers: { Starter: false, Scale: true, Growth: true },
      },
    ],
  },
];

// TODO: add stripe links to business payment products
// TODO: ensure the stripe links are enriched with proper customer id and email
// TODO: update product descriptions
export const BusinessAccountsPaymentPage = () => {
  const [frequency, setFrequency] = useState(frequencies[0]);
  const currentUserAccount = useAppSelector(selectCurrentUserAccount);
  const currentFinancialProfile = useAppSelector(selectUserFinancialProfile);

  const { stripeCustomerId } = currentFinancialProfile;
  const { email } = currentUserAccount;

  return (
    <div className="p-10 bg-black lg:p-20">
      <div className="overflow-hidden isolate">
        <Logo className="p-2 text-white" />
        <div className="flow-root pt-24 pb-16 sm:pt-32 lg:pb-0">
          <div className="px-6 mx-auto max-w-7xl lg:px-8">
            <div className="relative z-10">
              <h2 className="max-w-4xl mx-auto text-5xl font-bold tracking-tight text-center text-white">
                Pricing plans for businesses of all sizes
              </h2>
              <p className="max-w-2xl mx-auto mt-4 text-lg leading-8 text-center text-white/60">
                Select a cost-effective package brimming with premium features
                to guide your financial journey, foster business growth, and
                ensure entrepreneurial success with Solomon-AI
              </p>
              <div className="flex justify-center mt-16">
                <RadioGroup
                  value={frequency}
                  onChange={setFrequency}
                  className="grid grid-cols-2 p-1 text-xs font-semibold leading-5 text-center text-white rounded-full gap-x-1 bg-white/5"
                >
                  <RadioGroup.Label className="sr-only">
                    Payment frequency
                  </RadioGroup.Label>
                  {frequencies.map((option) => (
                    <RadioGroup.Option
                      key={option.value}
                      value={option}
                      className={({ checked }) =>
                        cn(
                          checked ? "bg-blue-600" : "",
                          "cursor-pointer rounded-full px-2.5 py-1",
                        )
                      }
                    >
                      <span>{option.label}</span>
                    </RadioGroup.Option>
                  ))}
                </RadioGroup>
              </div>
            </div>
            <div className="relative grid max-w-md grid-cols-1 mx-auto mt-10 gap-y-8 lg:mx-0 lg:-mb-14 lg:max-w-none lg:grid-cols-3">
              <svg
                viewBox="0 0 1208 1024"
                aria-hidden="true"
                className="absolute -bottom-48 left-1/2 h-[64rem] -translate-x-1/2 translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] lg:-top-48 lg:bottom-auto lg:translate-y-0"
              >
                <ellipse
                  cx={604}
                  cy={512}
                  fill="url(#d25c25d4-6d43-4bf9-b9ac-1842a30a4867)"
                  rx={604}
                  ry={512}
                />
                <defs>
                  <radialGradient id="d25c25d4-6d43-4bf9-b9ac-1842a30a4867">
                    <stop stopColor="#7775D6" />
                    <stop offset={1} stopColor="#E935C1" />
                  </radialGradient>
                </defs>
              </svg>
              <div
                className="hidden lg:absolute lg:inset-x-px lg:bottom-0 lg:top-4 lg:block lg:rounded-t-2xl lg:bg-gray-800/80 lg:ring-1 lg:ring-white/10"
                aria-hidden="true"
              />
              {tiers.map((tier) => (
                <div
                  key={tier.id}
                  className={cn(
                    tier.featured
                      ? "z-10 bg-white shadow-xl ring-1 ring-gray-900/10"
                      : "bg-gray-800/80 ring-1 ring-white/10 lg:bg-transparent lg:pb-14 lg:ring-0",
                    "relative rounded-2xl",
                  )}
                >
                  <div className="p-8 lg:pt-12 xl:p-10 xl:pt-14">
                    <h3
                      id={tier.id}
                      className={cn(
                        tier.featured ? "text-gray-900" : "text-white",
                        "text-sm font-semibold leading-6",
                      )}
                    >
                      {tier.name}
                    </h3>
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between lg:flex-col lg:items-stretch">
                      <div className="flex items-center mt-2 gap-x-4">
                        <p
                          className={cn(
                            tier.featured ? "text-gray-900" : "text-white",
                            "text-4xl font-bold tracking-tight",
                          )}
                        >
                          {tier.price[frequency.value as keyof Price]}
                        </p>
                        <div className="text-sm leading-5">
                          <p
                            className={
                              tier.featured ? "text-gray-900" : "text-white"
                            }
                          >
                            USD
                          </p>
                          <p
                            className={
                              tier.featured ? "text-gray-500" : "text-gray-400"
                            }
                          >{`Billed ${frequency.value}`}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          window.location.href = enrichPaymentLink(
                            tier.href,
                            stripeCustomerId,
                            email,
                          );
                        }}
                        aria-describedby={tier.id}
                        className={cn(
                          tier.featured
                            ? "bg-blue-600 shadow-sm hover:bg-blue-500 focus-visible:outline-blue-600"
                            : "bg-white/10 hover:bg-white/20 focus-visible:outline-white",
                          "rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                        )}
                      >
                        Buy this plan
                      </Button>
                    </div>
                    <div className="flow-root mt-8 sm:mt-10">
                      <ul
                        role="list"
                        className={cn(
                          tier.featured
                            ? "divide-gray-900/5 border-gray-900/5 text-gray-600"
                            : "divide-white/5 border-white/5 text-white",
                          "-my-2 divide-y border-t text-sm leading-6 lg:border-t-0",
                        )}
                      >
                        {tier.mainFeatures.map((mainFeature) => (
                          <li key={mainFeature} className="flex py-2 gap-x-3">
                            <CheckIcon
                              className={cn(
                                tier.featured
                                  ? "text-blue-600"
                                  : "text-gray-500",
                                "h-6 w-5 flex-none",
                              )}
                              aria-hidden="true"
                            />
                            {mainFeature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="relative bg-gray-50 lg:pt-14">
          <div className="px-6 py-24 mx-auto max-w-7xl sm:py-32 lg:px-8">
            {/* Feature comparison (up to lg) */}
            <section
              aria-labelledby="mobile-comparison-heading"
              className="lg:hidden"
            >
              <h2 id="mobile-comparison-heading" className="sr-only">
                Feature comparison
              </h2>

              <div className="max-w-2xl mx-auto space-y-16">
                {tiers.map((tier) => (
                  <div key={tier.id} className="border-t border-gray-900/10">
                    <div
                      className={cn(
                        tier.featured
                          ? "border-blue-600"
                          : "border-transparent",
                        "-mt-px w-72 border-t-2 pt-10 md:w-80",
                      )}
                    >
                      <h3
                        className={cn(
                          tier.featured ? "text-blue-600" : "text-gray-900",
                          "text-sm font-semibold leading-6",
                        )}
                      >
                        {tier.name}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-gray-600">
                        {tier.description}
                      </p>
                    </div>

                    <div className="mt-10 space-y-10">
                      {sections.map((section) => (
                        <div key={section.name}>
                          <h4 className="text-sm font-semibold leading-6 text-gray-900">
                            {section.name}
                          </h4>
                          <div className="relative mt-6">
                            {/* Fake card background */}
                            <div
                              aria-hidden="true"
                              className="absolute inset-y-0 right-0 hidden w-1/2 bg-white rounded-lg shadow-sm sm:block"
                            />

                            <div
                              className={cn(
                                tier.featured
                                  ? "ring-2 ring-blue-600"
                                  : "ring-1 ring-gray-900/10",
                                "relative rounded-lg bg-white shadow-sm sm:rounded-none sm:bg-transparent sm:shadow-none sm:ring-0",
                              )}
                            >
                              <dl className="text-sm leading-6 divide-y divide-gray-200">
                                {section.features.map((feature) => (
                                  <div
                                    key={feature.name}
                                    className="flex items-center justify-between px-4 py-3 sm:grid sm:grid-cols-2 sm:px-0"
                                  >
                                    <dt className="pr-4 text-gray-600">
                                      {feature.name}
                                    </dt>
                                    <dd className="flex items-center justify-end sm:justify-center sm:px-4">
                                      {typeof feature.tiers[tier.name] ===
                                      "string" ? (
                                        <span
                                          className={
                                            tier.featured
                                              ? "font-semibold text-blue-600"
                                              : "text-gray-900"
                                          }
                                        >
                                          {feature.tiers[tier.name]}
                                        </span>
                                      ) : (
                                        <>
                                          {feature.tiers[tier.name] === true ? (
                                            <CheckIcon
                                              className="w-5 h-5 mx-auto text-blue-600"
                                              aria-hidden="true"
                                            />
                                          ) : (
                                            <XMarkIcon
                                              className="w-5 h-5 mx-auto text-gray-400"
                                              aria-hidden="true"
                                            />
                                          )}

                                          <span className="sr-only">
                                            {feature.tiers[tier.name] === true
                                              ? "Yes"
                                              : "No"}
                                          </span>
                                        </>
                                      )}
                                    </dd>
                                  </div>
                                ))}
                              </dl>
                            </div>

                            {/* Fake card border */}
                            <div
                              aria-hidden="true"
                              className={cn(
                                tier.featured
                                  ? "ring-2 ring-blue-600"
                                  : "ring-1 ring-gray-900/10",
                                "pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 rounded-lg sm:block",
                              )}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Feature comparison (lg+) */}
            <section
              aria-labelledby="comparison-heading"
              className="hidden lg:block"
            >
              <h2 id="comparison-heading" className="sr-only">
                Feature comparison
              </h2>

              <div className="grid grid-cols-4 border-t gap-x-8 border-gray-900/10 before:block">
                {tiers.map((tier) => (
                  <div key={tier.id} aria-hidden="true" className="-mt-px">
                    <div
                      className={cn(
                        tier.featured
                          ? "border-blue-600"
                          : "border-transparent",
                        "border-t-2 pt-10",
                      )}
                    >
                      <p
                        className={cn(
                          tier.featured ? "text-blue-600" : "text-gray-900",
                          "text-sm font-semibold leading-6",
                        )}
                      >
                        {tier.name}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-gray-600">
                        {tier.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="-mt-6 space-y-16">
                {sections.map((section) => (
                  <div key={section.name}>
                    <h3 className="text-sm font-semibold leading-6 text-gray-900">
                      {section.name}
                    </h3>
                    <div className="relative mt-10 -mx-8">
                      {/* Fake card backgrounds */}
                      <div
                        className="absolute inset-y-0 grid grid-cols-4 inset-x-8 gap-x-8 before:block"
                        aria-hidden="true"
                      >
                        <div className="w-full h-full bg-white rounded-lg shadow-sm" />
                        <div className="w-full h-full bg-white rounded-lg shadow-sm" />
                        <div className="w-full h-full bg-white rounded-lg shadow-sm" />
                      </div>

                      <table className="relative w-full border-separate border-spacing-x-8">
                        <thead>
                          <tr className="text-left">
                            <th scope="col">
                              <span className="sr-only">Feature</span>
                            </th>
                            {tiers.map((tier) => (
                              <th key={tier.id} scope="col">
                                <span className="sr-only">
                                  {tier.name} tier
                                </span>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {section.features.map((feature, featureIdx) => (
                            <tr key={feature.name}>
                              <th
                                scope="row"
                                className="w-1/4 py-3 pr-4 text-sm font-normal leading-6 text-left text-gray-900"
                              >
                                {feature.name}
                                {featureIdx !== section.features.length - 1 ? (
                                  <div className="absolute h-px mt-3 bg-gray-200 inset-x-8" />
                                ) : null}
                              </th>
                              {tiers.map((tier) => (
                                <td
                                  key={tier.id}
                                  className="relative w-1/4 px-4 py-0 text-center"
                                >
                                  <span className="relative w-full h-full py-3">
                                    {typeof feature.tiers[tier.name] ===
                                    "string" ? (
                                      <span
                                        className={cn(
                                          tier.featured
                                            ? "font-semibold text-blue-600"
                                            : "text-gray-900",
                                          "text-sm leading-6",
                                        )}
                                      >
                                        {feature.tiers[tier.name]}
                                      </span>
                                    ) : (
                                      <>
                                        {feature.tiers[tier.name] === true ? (
                                          <CheckIcon
                                            className="w-5 h-5 mx-auto text-blue-600"
                                            aria-hidden="true"
                                          />
                                        ) : (
                                          <XMarkIcon
                                            className="w-5 h-5 mx-auto text-gray-400"
                                            aria-hidden="true"
                                          />
                                        )}

                                        <span className="sr-only">
                                          {feature.tiers[tier.name] === true
                                            ? "Yes"
                                            : "No"}
                                        </span>
                                      </>
                                    )}
                                  </span>
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* Fake card borders */}
                      <div
                        className="absolute inset-y-0 grid grid-cols-4 pointer-events-none inset-x-8 gap-x-8 before:block"
                        aria-hidden="true"
                      >
                        {tiers.map((tier) => (
                          <div
                            key={tier.id}
                            className={cn(
                              tier.featured
                                ? "ring-2 ring-blue-600"
                                : "ring-1 ring-gray-900/10",
                              "rounded-lg",
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
