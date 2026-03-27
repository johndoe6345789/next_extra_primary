## Description
<!-- Brief description of changes to the package repository -->

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Component
- [ ] Backend (C++ Drogon)
- [ ] Frontend (Next.js)
- [ ] Manager CLI integration
- [ ] Docker / Infrastructure
- [ ] Migrations / Schema

## Checklist
- [ ] Backend: all queries use parameterized `$N` placeholders
- [ ] Backend: all source files under 100 LOC
- [ ] Frontend: no hardcoded URLs or secrets
- [ ] Docker: backend image builds and starts cleanly
- [ ] Tested locally with `act -W .local/workflows/ci.yml`
- [ ] No secrets or .env values committed
