#pragma once

/**
 * @file GotenbergClient.h
 * @brief Drogon HTTP client for the Gotenberg sidecar.
 *
 * Posts a multipart/form-data request containing an @c index.html
 * part to @c {gotenbergUrl}{gotenbergPath}.  On success Gotenberg
 * returns the raw PDF bytes as the response body.  The class is
 * thread-safe and cheap to construct; reuse a single instance per
 * worker.
 */

#include "services/pdf/PdfTypes.h"

#include <functional>
#include <string>

namespace nextra::pdf
{

/**
 * @class GotenbergClient
 * @brief Posts HTML to Gotenberg and returns the rendered PDF bytes.
 */
class GotenbergClient
{
public:
    /// Ready-to-use PDF bytes (binary string).
    using OnSuccess = std::function<void(std::string pdf)>;

    /// Human-readable error message; status is -1 on network errors.
    using OnError   = std::function<void(int status,
                                         std::string message)>;

    explicit GotenbergClient(PdfConfig cfg);

    /**
     * @brief Synchronously render one HTML document to PDF.
     * @param html The complete HTML document to convert.
     * @param onOk  Called with binary PDF bytes on success.
     * @param onErr Called with status + message on failure.
     */
    void render(const std::string& html,
                const OnSuccess& onOk,
                const OnError&   onErr);

private:
    PdfConfig cfg_;
};

}  // namespace nextra::pdf
