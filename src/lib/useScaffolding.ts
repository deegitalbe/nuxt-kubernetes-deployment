import {
  useConfirm,
  useCurrentPath,
  useGenerator,
  useDisplayJson,
  usePackageStubsPath,
  usePrompt,
  useSentence,
} from "@henrotaym/scaffolding-utils";

const useStubsPath = usePackageStubsPath(
  "@deegital/nuxt-kubernetes-deployment"
);

const useDeploymentPath = (...paths: string[]) =>
  useStubsPath("deployments", ...paths);

const useScaffolding = () => {
  useSentence("Hi there 👋");
  useSentence("Let's scaffold a new nuxt kubernetes deployment 🎉");

  const folder = usePrompt("Folder location [.]", ".");

  const useDesiredPath = (...paths: string[]) =>
    useCurrentPath(folder, ...paths);

  const useDevopsPath = (...paths: string[]) =>
    useDesiredPath("devops", env, ...paths);

  const location = useDesiredPath();
  const lastFolderLocationName = location.split("/").slice(-1)[0];

  const key = usePrompt(
    `App key [${lastFolderLocationName}]`,
    lastFolderLocationName
  );
  const cloudflareKey = usePrompt("Cloudflare API key");

  const env = usePrompt("Environment [production]", "production");
  const host = usePrompt("App url");
  const branch = env === "production" ? "main" : "release/v*";

  const data = { key, cloudflareKey, env, host, branch };

  useDisplayJson({ location, ...data });

  const isConfirmed = useConfirm("Is it correct ? ");

  if (!isConfirmed) {
    useSentence("Scaffolding was cancelled ❌");
    useSentence("Come back when you're ready 😎");
    return;
  }

  const generator = useGenerator(data);

  generator.copy(
    useDeploymentPath(".github", "workflows", "kubernetes-deployment.yml"),
    useDesiredPath(".github", "workflows", `kubernetes-${env}-deployment.yml`)
  );

  generator.copy(useDeploymentPath("docker"), useDesiredPath());

  generator.copy(useDeploymentPath("kubernetes"), useDevopsPath("kubernetes"));

  generator.copy(
    useDeploymentPath("infrastructure"),
    useDevopsPath("infrastructure")
  );

  useSentence(`Successfully created a ${env} deployment ✅`);
  useSentence("Happy coding 🍺");
};

export default useScaffolding;
