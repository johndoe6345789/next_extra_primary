#pragma once

/**
 * @file S3Upload.h
 * @brief Tiny uploader that PUTs a blob to the in-repo s3server.
 *
 * The s3server ships with the template and speaks the S3 REST API
 * plus a lightweight anonymous path-style upload that the other
 * daemons use during local dev.  The renderer only needs a one-shot
 * PUT of a single object, so we avoid pulling in the full AWS SDK.
 */

#include "pdf/backend/PdfTypes.h"

#include <string>

namespace nextra::pdf
{

/**
 * @class S3Upload
 * @brief One-shot blob uploader for the pdf-generator daemon.
 */
class S3Upload
{
public:
    explicit S3Upload(PdfConfig cfg);

    /**
     * @brief Upload @p bytes to bucket/key and return the final key.
     * @param key   Object key (e.g. "renders/123.pdf").
     * @param bytes Binary PDF content.
     * @return Final key stored in s3server (same as input on success).
     * @throws std::runtime_error if the upload failed.
     */
    std::string put(const std::string& key,
                    const std::string& bytes) const;

private:
    PdfConfig cfg_;
};

}  // namespace nextra::pdf
