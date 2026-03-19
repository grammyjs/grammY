// Check and update contributor information from GitHub API
const config = JSON.parse(await Deno.readTextFile(".all-contributorsrc"));
const changes: string[] = [];
let hasChanges = false;

console.log(`Checking ${config.contributors.length} contributors...`);

for (const c of config.contributors) {
    // Use stored user_id if available, otherwise fall back to login lookup
    const endpoint = c.user_id
        ? `https://api.github.com/user/${c.user_id}`
        : `https://api.github.com/users/${c.login}`;

    const res = await fetch(endpoint, {
        headers: {
            "Authorization": `Bearer ${Deno.env.get("GITHUB_TOKEN")}`,
            "Accept": "application/vnd.github+json",
        },
    });

    if (!res.ok) {
        if (res.status === 404) {
            console.log(
                `${c.login}: Account not found (may be deleted)`,
            );
            changes.push(
                `- **${c.login}**: Account not found - may have been deleted (manual update needed)`,
            );
            hasChanges = true;
        } else {
            const body = await res.text();
            console.error(
                `${c.login}: API error ${res.status}: ${body.slice(0, 200)}`,
            );
        }
        continue;
    }

    const user = await res.json();
    const name = user.name || user.login;

    // Store user_id if not present (for future lookups)
    if (!c.user_id) {
        console.log(`  ${c.login}: Storing user ID ${user.id}`);
        c.user_id = user.id;
        hasChanges = true;
    }

    // Check if username changed (ignore case-only changes)
    if (c.login.toLowerCase() !== user.login.toLowerCase()) {
        console.log(`  ${c.login}: Username changed to "${user.login}"`);
        changes.push(
            `- **${c.login}**: Username changed to **${user.login}**`,
        );
        c.login = user.login;
        c.profile = user.html_url;
        hasChanges = true;
    }

    if (c.name !== name && c.name.toLowerCase() !== name.toLowerCase()) {
        console.log(`  ${c.login}: "${c.name}" → "${name}"`);
        changes.push(
            `- **${c.login}**: Name updated from "${c.name}" to "${name}"`,
        );
        c.name = name;
        hasChanges = true;
    }

    if (c.avatar_url !== user.avatar_url) {
        console.log(`  ${c.login}: Avatar updated`);
        changes.push(`- **${c.login}**: Avatar URL updated`);
        c.avatar_url = user.avatar_url;
        hasChanges = true;
    }

    await new Promise((r) => setTimeout(r, 100));
}

const githubOutput = Deno.env.get("GITHUB_OUTPUT");

if (hasChanges) {
    await Deno.writeTextFile(
        ".all-contributorsrc",
        JSON.stringify(config, null, 2) + "\n",
    );
    console.log(`\nUpdated with ${changes.length} change(s)`);
    if (githubOutput) {
        const delimiter = `ghadelimiter_${crypto.randomUUID()}`;
        await Deno.writeTextFile(
            githubOutput,
            `changes=true\ndetails<<${delimiter}\n\n${
                changes.join("\n")
            }\n${delimiter}\n`,
            { append: true },
        );
    }
} else {
    console.log("\nNo changes detected");
    if (githubOutput) {
        await Deno.writeTextFile(githubOutput, "changes=false\n", {
            append: true,
        });
    }
}
