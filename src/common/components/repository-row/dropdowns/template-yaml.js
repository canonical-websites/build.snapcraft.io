export default function templateYaml(name, registered) {
  let repoName = name;
  let registeredName = registered;

  if (!name) {
    repoName = 'my-repo-name';
  }

  if (!registered) {
    registeredName = 'name';
  }

  const template = `
  name: ${repoName} # you probably want to 'snapcraft register <${registeredName}>'
  version: '0.1' # just for humans, typically '1.2+git' or '1.3.2'
  summary: Single-line elevator pitch for your amazing snap # 79 char long summary
  description: |
    This is my-snap's description. You have a paragraph or two to tell the
    most important story about your snap. Keep it under 100 words though,
    we live in tweetspace and your description wants to look good in the snap
    store.

  grade: devel # must be 'stable' to release into candidate/stable channels
  confinement: devmode # use 'strict' once you have the right plugs and slots

  parts:
    my-part:
      # See 'snapcraft plugins'
      plugin: nil
  `;

  return template;
}
