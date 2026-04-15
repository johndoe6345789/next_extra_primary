/**
 * @file services/search/Indexer.cpp
 * @brief Reindex control flow (the actual
 *        NDJSON builder and status writer live
 *        in IndexerHelpers.cpp).
 */

#include "services/search/Indexer.h"

#include <format>

namespace nextra::search
{

Indexer::Indexer(drogon::orm::DbClientPtr db,
                 std::shared_ptr<ElasticClient> es,
                 IndexDef def,
                 std::int32_t batchSize)
    : db_(std::move(db)),
      es_(std::move(es)),
      def_(std::move(def)),
      batchSize_(batchSize)
{}

void Indexer::reindex(EsOk onOk, EsErr onErr)
{
    writeStatus("reindexing", 0);
    es_->createIndex(def_.esIndex,
        [this, onOk, onErr](json) {
            runBulk(onOk, onErr);
        },
        [this, onErr](int c, std::string m) {
            writeStatus("error", 0);
            onErr(c, m);
        });
}

void Indexer::runBulk(EsOk onOk, EsErr onErr)
{
    try {
        auto rows = db_->execSqlSync(std::format(
            "SELECT * FROM {} LIMIT {}",
            def_.targetTable, batchSize_));
        auto body = buildNdjson(rows);
        auto n = static_cast<std::int64_t>(
            rows.size());
        if (body.empty()) {
            writeStatus("idle", 0);
            onOk(json{{"indexed", 0}});
            return;
        }
        es_->bulk(def_.esIndex, body,
            [this, onOk, n](json r) {
                writeStatus("idle", n);
                onOk(r);
            },
            [this, onErr](int c, std::string m) {
                writeStatus("error", 0);
                onErr(c, m);
            });
    } catch (const std::exception& e) {
        writeStatus("error", 0);
        onErr(500, e.what());
    }
}

} // namespace nextra::search
