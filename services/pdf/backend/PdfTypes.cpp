/**
 * @file PdfTypes.cpp
 * @brief String conversions for @ref nextra::pdf types.
 */

#include "pdf/backend/PdfTypes.h"

#include <stdexcept>

namespace nextra::pdf
{

std::string toString(PdfStatus s)
{
    switch (s)
    {
        case PdfStatus::Queued:    return "queued";
        case PdfStatus::Rendering: return "rendering";
        case PdfStatus::Succeeded: return "succeeded";
        case PdfStatus::Failed:    return "failed";
    }
    throw std::logic_error("unreachable PdfStatus");
}

PdfStatus parsePdfStatus(const std::string& s)
{
    if (s == "queued")    return PdfStatus::Queued;
    if (s == "rendering") return PdfStatus::Rendering;
    if (s == "succeeded") return PdfStatus::Succeeded;
    if (s == "failed")    return PdfStatus::Failed;
    throw std::invalid_argument("unknown PdfStatus: " + s);
}

}  // namespace nextra::pdf
