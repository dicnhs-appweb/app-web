import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export function SrpData() {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          View the Latest Suggested Retail Prices (SRPs)
        </AccordionTrigger>
        <AccordionContent>
          <div className="mb-4">
            <h2 className="mb-2 text-lg font-semibold">
              Latest Suggested Retail Prices (SRPs) of Basic Necessities and
              Prime Commodities
            </h2>
            <p className="mb-2">
              The DTI provides updated suggested retail prices (SRPs) for basic
              necessities and prime commodities (BNPCs) such as, but not limited
              to, canned and other food products, bottled water, dairy, and
              common household or kitchen supplies.
            </p>
            <p className="text-sm text-gray-600">
              Source:{' '}
              <a
                href="https://www.dti.gov.ph/konsyumer/latest-srps-basic-necessities-prime-commodities/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Department of Trade and Industry
              </a>
            </p>
          </div>
          <iframe
            src={
              'https://dtiwebfiles.s3.ap-southeast-1.amazonaws.com/e-Presyo/SRP+Basic+Necessities+and+Prime+Commodities/2024/12+JAN+2024+-+BNPC+BULLETIN+SRP+ADJUSTMENTS+240110.pdf'
            }
            className="w-full h-[95vh]"
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
