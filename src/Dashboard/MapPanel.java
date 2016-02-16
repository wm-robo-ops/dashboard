package Dashboard;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Container;
import java.awt.Dimension;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.image.BufferedImage;
import java.net.URL;
import javax.imageio.ImageIO;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JTextArea;

public class MapPanel {

	//Fields for MapPanel
	private String url = "https://maps.googleapis.com/maps/api/staticmap?center=29.564835,-95.081320&zoom=19&size=640x640&maptype"
			+ "=satellite&scale=2"; //standard url minus API key
	private String key = "&format=png&key=AIzaSyDBb3g0eo0EZaX5eCQQtAn5Rsi7DgIYByk"; //personal API key for url
	private String finalURL = url + key; //url to be used
	private JPanel mainPanel;
	private JPanel mapPanel;
	private JPanel addPointPanel;
	private JLabel picLabel;
	private BufferedImage previewImage;
	
	public static JButton inputButton = new JButton("Send");
	public static JTextArea editTextArea = new JTextArea("Type Here!");
	public static JTextArea uneditTextArea = new JTextArea();
	private String myString;
	
	/**
	 * Constructor, builds JPanel and adds map to it
	 */
	public MapPanel(){
		mainPanel = new JPanel(new BorderLayout());
		mapPanel = new JPanel();
		try{
			previewImage = ImageIO.read(new URL(finalURL));
			previewImage = resize(previewImage, 700, 700);
			picLabel = new JLabel(new ImageIcon(previewImage));
			picLabel.setPreferredSize(new Dimension(100, 100));
			mapPanel.add(picLabel, BorderLayout.NORTH);
		} catch(Exception e){
			//Do nothing
		}
		addPointPanel = new JPanel();
		addPointPanel.setPreferredSize( new Dimension(100, 100) );
		addPointPanel.setLayout(new BorderLayout());
		uneditTextArea.setEditable(false);
		editTextArea.setBackground(Color.BLUE);
		editTextArea.setForeground(Color.WHITE);     
		addPointPanel.add(uneditTextArea, BorderLayout.EAST);
		addPointPanel.add(editTextArea, BorderLayout.SOUTH);
		addPointPanel.add(inputButton, BorderLayout.WEST);
		this.inputButton.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				myString = editTextArea.getText();
				System.out.println(myString);
			}
		});
		mainPanel.add(mapPanel, BorderLayout.EAST);
		mainPanel.add(addPointPanel, BorderLayout.WEST);
	}
	
	/**
	 * 
	 * @param img
	 * @param newW
	 * @param newH
	 * @return
	 */
	public static BufferedImage resize(BufferedImage img, int newW, int newH) { 
	    Image tmp = img.getScaledInstance(newW, newH, Image.SCALE_SMOOTH);
	    BufferedImage dimg = new BufferedImage(newW, newH, BufferedImage.TYPE_INT_ARGB);

	    Graphics2D g2d = dimg.createGraphics();
	    g2d.drawImage(tmp, 0, 0, null);
	    g2d.dispose();

	    return dimg;
	}  
	
	/**
	 * Returns the JPanel
	 * @return JPanel object
	 */
	public JPanel getPanel(){
		return mainPanel;
	}
	
	/**
	 * Adds a point to the map image
	 * @param color the color of the point
	 * @param xcoord the x-coordinate for the point
	 * @param ycoord the y-coordinate for the point
	 */
	public void addPoint(String color, double xcoord, double ycoord){
		this.url = this.url + "&markers=color:" + color + "%7Csize:tiny%7C" + Double.toString(xcoord) + "," + Double.toString(ycoord);
		this.finalURL = this.url + this.key;
		updateImage();
	}
	
	/**
	 * Removes old JPanel and adds new one with updated URL
	 */
	private void updateImage(){
		try{
			mapPanel.removeAll();
			this.previewImage = ImageIO.read(new URL(finalURL));
			this.picLabel = new JLabel(new ImageIcon(previewImage));
			mapPanel.add(picLabel);
		} catch(Exception e){
			//Do Nothing
		}
		mapPanel.revalidate();
		mapPanel.repaint();
	}
	
	
}
