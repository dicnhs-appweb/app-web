#!/bin/bash

# Array of commit messages and corresponding files
declare -A commits=(
  ["feat(product calculation form): add product calculation form component"]="src/features/auth/product/components/product-calculation-form.tsx"
  ["feat(edit expense dialog): add edit expense dialog component"]="src/features/auth/product/components/edit-expense-dialog.tsx"
  ["feat(operational total chart): add operational total chart component"]="src/features/auth/product/components/operational-total/donut-chart.tsx"
  ["feat(overhead expenses table): add overhead expenses table component"]="src/features/auth/product/components/overhead-expenses-table/view-table.tsx"
  ["feat(overhead expense columns): add overhead expense columns definition"]="src/features/auth/product/components/overhead-expenses-table/columns.tsx"
  ["feat(edit material dialog): add edit material dialog component"]="src/features/auth/product/components/edit-material-dialog.tsx"
  ["feat(product store): add product store with actions"]="src/features/auth/product/store/useRawMaterialStore.ts"
  ["chore(tailwind css): add tailwind css configuration"]="tailwind.config.js"
  ["chore(biome): add biome configuration"]="biome.json"
  ["chore(package dependencies): add package dependencies"]="package.json"
  ["chore(typescript): add typescript configuration"]="tsconfig.json tsconfig.app.json tsconfig.node.json"
  ["chore(jest): add jest configuration"]="jest.config.mjs"
  ["chore(utility functions): add utility functions"]="src/lib/utils.ts"
  ["feat(card ui): add card ui component"]="src/components/ui/card.tsx"
  ["feat(dialog ui): add dialog ui component"]="src/components/ui/dialog.tsx"
  ["feat(drawer ui): add drawer ui component"]="src/components/ui/drawer.tsx"
  ["feat(context menu ui): add context menu ui component"]="src/components/ui/context-menu.tsx"
  ["feat(badge ui): add badge ui component"]="src/components/ui/badge.tsx"
  ["feat(dropdown menu ui): add dropdown menu ui component"]="src/components/ui/dropdown-menu.tsx"
  ["feat(chart ui): add chart ui component"]="src/components/ui/chart.tsx"
  ["feat(product card): add product card component"]="src/features/auth/dashboard/component/presentation/product-card.tsx"
  ["feat(update product api): add update product api"]="src/features/auth/dashboard/api/update-product.ts"
  ["chore(data json): add data json for products"]="src/features/auth/product/api/data.json"
  ["chore(dependency graph): add dependency graph settings"]=".dependencygraph/setting.json"
  ["chore(route tree): add route tree generation"]="src/routeTree.gen.ts"
  ["chore(tailwind css base): add tailwind css base styles"]="src/index.css"
  ["docs(readme): add readme for project setup"]="README.md"
  ["chore(prettier): add prettier configuration"]=".prettierrc"
  ["chore(git ignore): add git ignore configuration"]="gitignore"
  ["chore(dependency graph data): add dependency graph data"]=".dependencygraph/data.json"
  ["chore(components): add components configuration"]="components.json"
)

# Initial commit date
commit_date="2024-08-20T19:00:00"

# Loop through commit messages and create commits with different timestamps
for message in "${!commits[@]}"; do
  # Stage the specific files
  git add ${commits[$message]}

  # Commit with the message
  GIT_COMMITTER_DATE="$commit_date" git commit -m "$message" --date "$commit_date"

  # Increment the commit date by 1 hour
  commit_date=$(date -d "$commit_date + 1 hour" +"%Y-%m-%dT%H:%M:%S")
done

echo "Commits created successfully with different timestamps."