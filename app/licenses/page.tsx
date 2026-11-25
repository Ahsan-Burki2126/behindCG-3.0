import LegalPage from '@/components/LegalPage';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata('/licenses');

const rows = [
  { label: 'Who can use it', personal: 'One artist', studio: 'Up to [00] seats in one company' },
  { label: 'Paid client work', personal: 'Yes', studio: 'Yes' },
  { label: 'Updates', personal: 'Free', studio: 'Free' },
  { label: 'Install on', personal: '[Your own computers]', studio: '[Any company computer]' },
  { label: 'Price', personal: 'Listed on each addon', studio: 'Listed on each addon' },
];

export default function Licenses() {
  return (
    <LegalPage
      title="Licences"
      lead="What you can do with Behind CG addons, scene files, free downloads, courses and client renders, in plain words."
      updated="[Date]"
      sections={[
        {
          id: 'addons',
          title: 'Blender addons',
          body: (
            <>
              <p>Every addon is sold with a Personal or Studio licence. Both allow paid client work.</p>
              <div className="tbl-wrap">
                <table className="tbl">
                  <thead><tr><th scope="col">Licence</th><th scope="col">Personal</th><th scope="col">Studio</th></tr></thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.label}><th scope="row">{r.label}</th><td>{r.personal}</td><td>{r.studio}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>Addon code is released under the GNU GPL, as Blender requires for addons. Your licence covers the files, updates and support you buy from us. [Confirm with legal review.]</p>
            </>
          ),
        },
        {
          id: 'scene-files',
          title: 'Scene files and free downloads',
          body: (
            <ul>
              <li>You can render the scenes and use the renders in personal and commercial work.</li>
              <li>You cannot resell, share or redistribute the scene files or their textures, changed or unchanged.</li>
              <li>[Attribution requirements, if any.]</li>
            </ul>
          ),
        },
        {
          id: 'courses',
          title: 'Courses',
          body: <p>Course videos are for the person who bought them. Project files come with the same terms as scene files. Do not share logins or re-upload lessons.</p>,
        },
        {
          id: 'client-renders',
          title: 'Client renders and films',
          body: <p>Brands receive full commercial usage rights to delivered renders and films on final payment. Behind CG may show the work in its portfolio unless the contract says otherwise. See the terms.</p>,
        },
      ]}
    />
  );
}
